"use client"

import React from "react"

interface IouAnalysisProps {
  scores?: Record<string, number> | null
}

export default function IouAnalysis({ scores }: IouAnalysisProps) {
  if (!scores) return null

  return (
    <div className="py-6 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-5 py-4 bg-blue-50 border-l-4 border-blue-500 flex items-center gap-3">
        <i className="fas fa-crosshairs text-blue-600"></i>
        <h4 className="text-gray-900 font-semibold">Localization Analysis (IoU)</h4>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-600 mb-4">
          This measures how well the AI's area of focus (heatmap) overlapped with pre-annotated parts of the snake. A higher score means better localization.
        </p>
        <div className="flex justify-around gap-4">
          {Object.entries(scores).map(([part, score]) => (
            <div key={part} className="text-center p-2 rounded-lg bg-gray-100 flex-1">
              <div className="text-2xl font-bold text-blue-600">{(score * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{part} Overlap</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
