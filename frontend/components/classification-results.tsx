"use client"

import { useState } from "react"
import Image from "next/image"
import IouAnalysis from "./iou-analysis"

type SpeciesPrediction = {
  class_index?: number
  common_name: string
  scientific_name?: string
  family?: string
  description?: string
  confidence?: number
  is_venomous?: boolean
}

type ModelPrediction = {
  primary?: SpeciesPrediction
  alternatives?: SpeciesPrediction[]
  gradcam_image_base64?: string | null
  iou_analysis?: {
    scores?: Record<string, number> | null
  } | null
}

type CombinedResults = {
  model?: string
  prediction?: ModelPrediction
  attendensenet?: ModelPrediction
}

const formatConfidence = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A"
  return `${value.toFixed(2)}%`
}

const SingleModelResult = ({ modelName, data }: { modelName: string; data: ModelPrediction | undefined }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  if (!data?.primary) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        <i className="fas fa-exclamation-circle mb-3 text-4xl text-slate-400"></i>
        <p className="font-semibold">{modelName}</p>
        <p className="text-sm">No results to display.</p>
      </div>
    )
  }

  const primary = data.primary
  const alternatives = data.alternatives ?? []
  const gradcamImage = data.gradcam_image_base64
  const iouScores = data.iou_analysis?.scores ?? null

  const toggleAccordion = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="rounded-md bg-slate-100 p-3 text-center text-xl font-bold text-slate-800">{modelName}</h3>

      <div className="overflow-hidden rounded-md border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className={`flex items-center gap-5 p-5 ${primary.is_venomous ? "bg-red-50" : "bg-sky-50"}`}>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-sm bg-white/80 text-2xl ${primary.is_venomous ? "text-red-500" : "text-sky-600"}`}
          >
            <i className={`${primary.is_venomous ? "fas fa-skull-crossbones" : "fas fa-leaf"}`}></i>
          </div>
          <div className="flex-1">
            <h3 className={`mb-1 text-xl font-bold ${primary.is_venomous ? "text-red-600" : "text-sky-700"}`}>
              {primary.common_name}
            </h3>
            <p className="mb-1 text-sm italic text-slate-600">{primary.scientific_name || "Scientific name unavailable"}</p>
            <span className="rounded-sm bg-black/5 px-2 py-1 text-xs text-slate-500">Family: {primary.family || "N/A"}</span>
          </div>
          <div className="text-center">
            <div
              className={`mb-2 rounded-md px-3 py-2 text-2xl font-bold ${primary.is_venomous ? "bg-red-100 text-red-600" : "bg-sky-100 text-sky-800"}`}
            >
              {formatConfidence(primary.confidence)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-white p-5">
          <div className="text-center">
            <div
              className={`mb-3 rounded-md px-4 py-2 text-lg font-semibold ${primary.is_venomous ? "bg-red-100 text-red-600" : "bg-sky-100 text-sky-800"}`}
            >
              {primary.is_venomous ? "Venomous" : "Non-venomous"}
            </div>
            <p className="max-w-md text-sm text-slate-600">{primary.description || "No description available."}</p>
          </div>
        </div>
      </div>

      {gradcamImage && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-l-4 border-cyan-500 bg-cyan-50 px-5 py-4">
              <i className="fas fa-eye text-blue-600"></i>
              <h4 className="font-semibold text-slate-900">AI Focus (Grad-CAM)</h4>
            </div>
            <div className="p-2">
              <Image
                src={`data:image/png;base64,${gradcamImage}`}
                alt="Grad-CAM Visualization"
                width={400}
                height={320}
                className="h-auto max-h-80 w-full rounded-sm object-contain"
              />
            </div>
          </div>
          {iouScores && <IouAnalysis scores={iouScores} />}
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 px-5 py-4 font-semibold text-slate-900">
          <i className="fas fa-list-alt"></i>
          <span>Other Possible Species</span>
        </div>
        <div className="p-3">
          {alternatives.length === 0 && (
            <p className="px-2 py-4 text-sm text-slate-500">No alternative species were returned by the model.</p>
          )}

          {alternatives.map((alt, index) => (
            <div key={`${alt.common_name}-${index}`} className="border-b border-slate-200 last:border-b-0">
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors duration-200 hover:bg-slate-50"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex-1">
                  <h4 className="mb-1 flex items-center gap-2 text-base font-medium text-slate-900">
                    {alt.common_name}
                    <span
                      className={`rounded-sm px-2 py-1 text-xs ${alt.is_venomous ? "bg-red-100 text-red-600" : "bg-sky-100 text-sky-800"}`}
                    >
                      {alt.is_venomous ? "Venomous" : "Non-venomous"}
                    </span>
                  </h4>
                  <p className="mb-1 text-sm italic text-slate-600">{alt.scientific_name || "Scientific name unavailable"}</p>
                  <span className="rounded-sm bg-black/5 px-2 py-1 text-xs text-slate-500">{alt.family || "Family N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-slate-200 px-3 py-1 text-base font-semibold text-slate-700">
                    {formatConfidence(alt.confidence)}
                  </div>
                  <button
                    className={`flex h-8 w-8 items-center justify-center rounded-sm bg-slate-200 text-slate-600 transition-all duration-300 hover:bg-slate-300 ${expandedItems.includes(index) ? "rotate-180" : ""}`}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${expandedItems.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="border-t border-slate-200 bg-slate-50 px-4 pb-4">
                  <p className="pt-4 text-sm leading-relaxed text-slate-600">{alt.description || "No description available."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const normalizeModels = (results: any): Array<{ modelName: string; data: ModelPrediction | undefined }> => {
  if (!results) return []

  const typed = results as CombinedResults
  if (typed.prediction) {
    return [{ modelName: typed.model || "AttenDenseNet", data: typed.prediction }]
  }

  if (typed.attendensenet) {
    return [{ modelName: "AttenDenseNet", data: typed.attendensenet }]
  }

  return [{ modelName: "AttenDenseNet", data: results as ModelPrediction }]
}

export default function ClassificationResults({ results }: { results: any | null }) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
        <i className="fas fa-search mb-5 text-6xl text-slate-300"></i>
        <p className="max-w-xs">
          Upload a snake image to see AI identification results and confidence insights from your backend model.
        </p>
      </div>
    )
  }

  const models = normalizeModels(results)

  return (
    <div className="w-full">
      <div className={`grid grid-cols-1 gap-8 ${models.length > 1 ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
        {models.map((entry) => (
          <div key={entry.modelName}>
            <SingleModelResult modelName={entry.modelName} data={entry.data} />
          </div>
        ))}
      </div>
    </div>
  )
}
