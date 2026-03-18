"use client"

import { useState } from "react"
import ImageUpload from "@/components/image-upload"
import ClassificationResults from "@/components/classification-results"

export default function ClassificationPage() {
  const [results, setResults] = useState<any | null>(null)

  return (
    <main className="grid w-full grid-cols-1 gap-6 px-4 py-6 md:gap-8 md:px-12 md:py-8 lg:grid-cols-2 lg:items-start lg:px-24">
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center gap-3 text-xl font-extrabold text-slate-900 md:text-2xl">
            <i className="fas fa-camera-retro text-sky-700"></i>
            Snake Image Upload
          </h2>
          <p className="text-sm text-slate-600">
            Upload a clear image for AttenDenseNet inference to support rapid species identification and emergency
            routing decisions.
          </p>
        </div>

        <ImageUpload onResultsChange={setResults} />
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-6">
          <h2 className="flex items-center gap-3 text-xl font-extrabold text-slate-900 md:text-2xl">
            <i className="fas fa-microscope text-sky-700"></i>
            Classification Results
          </h2>
        </div>

        <ClassificationResults results={results} />
      </section>
    </main>
  )
}