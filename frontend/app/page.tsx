"use client"

import { useState } from "react"
import ImageUpload from "@/components/image-upload"
import ClassificationResults from "@/components/classification-results"

export default function Home() {
  const [results, setResults] = useState<any | null>(null)

  return (
    <>
      <main className={`grid grid-cols-1 gap-10 mb-10`}>
        {/* Upload Section */}
        <section className="bg-white rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="flex items-center gap-3 text-xl font-bold mb-2 text-gray-900">
              <i className="fas fa-camera text-2xl text-green-600"></i>
              Image Upload
            </h2>
            <p className="text-sm text-gray-500">Upload a clear image of the snake for identification</p>
          </div>

          <ImageUpload onResultsChange={setResults} />
        </section>

        {/* Results Section */}
        <section className="bg-white rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <i className="fas fa-clipboard-list text-2xl text-green-600"></i>
              Classification Results
            </h2>
          </div>

          <ClassificationResults results={results} />
        </section>
      </main>
    </>
  )
}
