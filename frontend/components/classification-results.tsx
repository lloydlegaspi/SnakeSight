"use client"

import { useState } from "react"
import Image from "next/image"
import IouAnalysis from "./iou-analysis"

// Sub-component to render the results for a single model
const SingleModelResult = ({ modelName, data }: { modelName: string; data: any }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 border rounded-xl bg-gray-50 text-gray-500">
        <i className="fas fa-exclamation-circle text-4xl mb-3 text-gray-400"></i>
        <p className="font-semibold">{modelName}</p>
        <p className="text-sm">No results to display.</p>
      </div>
    )
  }

  const { primary, alternatives, gradcam_image_base64, iou_analysis } = data

  const toggleAccordion = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-center text-gray-800 bg-gray-100 p-3 rounded-xl shadow-sm">{modelName}</h3>

      {/* Main Species Card */}
      <div className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className={`p-5 ${primary.is_venomous ? "bg-red-50" : "bg-green-50"} flex items-center gap-5`}>
          <div className={`w-12 h-12 rounded-full bg-white/80 flex items-center justify-center ${primary.is_venomous ? "text-red-500" : "text-green-500"} text-2xl`}>
            <i className={`${primary.is_venomous ? "fas fa-skull-crossbones" : "fas fa-leaf"}`}></i>
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-1 ${primary.is_venomous ? "text-red-600" : "text-green-600"}`}>
              {primary.common_name}
            </h3>
            <p className="text-sm italic text-gray-600 mb-1">{primary.scientific_name}</p>
            <span className="text-xs text-gray-500 bg-black/5 px-2 py-1 rounded-lg">Family: {primary.family}</span>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold px-3 py-2 rounded-full mb-2 ${primary.is_venomous ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"}`}>
              {primary.confidence.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="p-5 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className={`text-lg font-semibold ${primary.is_venomous ? "text-red-600 bg-red-100" : "bg-green-100 text-green-600"} px-4 py-2 rounded-full mb-3`}>
              {primary.is_venomous ? "Venomous" : "Non-venomous"}
            </div>
            <p className="text-sm text-gray-600 max-w-md">{primary.description}</p>
          </div>
        </div>
      </div>

      {/* GradCAM and IoU Analysis Section */}
      {gradcam_image_base64 && (
        <div className="space-y-6">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="px-5 py-4 bg-blue-50 border-l-4 border-blue-500 flex items-center gap-3">
              <i className="fas fa-eye text-blue-600"></i>
              <h4 className="text-gray-900 font-semibold">AI Focus (Grad-CAM)</h4>
            </div>
            <div className="p-2">
              <Image
                src={`data:image/png;base64,${gradcam_image_base64}`}
                alt="Grad-CAM Visualization"
                width={400}
                height={320}
                className="w-full h-auto max-h-80 object-contain rounded-lg"
              />
            </div>
          </div>
          {iou_analysis && <IouAnalysis scores={iou_analysis.scores} />}
        </div>
      )}

      {/* Alternative Species */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 bg-gray-200 flex items-center gap-3 text-gray-900 font-semibold">
          <i className="fas fa-list-alt"></i>
          <span>Other Possible Species</span>
        </div>
        <div className="p-3">
          {alternatives.map((alt: any, index: number) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 flex items-center gap-2 mb-1">
                    {alt.common_name}
                    <span className={`text-xs px-2 py-1 rounded-lg ${alt.is_venomous ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                      {alt.is_venomous ? "Venomous" : "Non-venomous"}
                    </span>
                  </h4>
                  <p className="text-sm italic text-gray-600 mb-1">{alt.scientific_name}</p>
                  <span className="text-xs text-gray-500 bg-black/5 px-2 py-1 rounded-lg">{alt.family}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-base font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                    {alt.confidence}%
                  </div>
                  <button className={`w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-all duration-300 ${expandedItems.includes(index) ? "rotate-180" : ""}`}>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${expandedItems.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed pt-4">{alt.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main component that orchestrates the two-column display
export default function ClassificationResults({ results }: { results: any | null }) {
  // Initial placeholder when no image has been processed
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
        <i className="fas fa-search text-6xl mb-5 text-gray-300"></i>
        <p className="max-w-xs">Upload a snake image to see identification results from AttenDenseNet model and DenseNet model.</p>
      </div>
    );
  }

  // Main two-column layout for displaying the results
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column for AttenDenseNet */}
        <div>
          <SingleModelResult modelName="AttenDenseNet" data={results.attendensenet} />
        </div>
        {/* Right Column for DenseNet */}
        <div>
          <SingleModelResult modelName="DenseNet" data={results.densenet} />
        </div>
      </div>
    </div>
  );
}
