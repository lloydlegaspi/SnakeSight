"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import Stepper from "./stepper"

interface ImageUploadProps {
  onResultsChange: (results: any) => void
}

export default function ImageUpload({ onResultsChange }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setCurrentStep(selectedFile ? 1 : 0)

    if (selectedFile) {
      setOriginalPreviewUrl(URL.createObjectURL(selectedFile))
    } else {
      setOriginalPreviewUrl(null)
    }
  }

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)

    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
      setCurrentStep(1)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file) return
    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/predict_all`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      onResultsChange(data)
      setCurrentStep(2)
    } catch (err) {
      console.error("Prediction failed:", err)
      alert("Prediction failed. Check backend logs.")
    } finally {
      setIsAnalyzing(false)
    }
  }, [file, onResultsChange])

  const handleReset = useCallback(() => {
    setFile(null)
    setOriginalPreviewUrl(null)
    setCurrentStep(0)
    setIsAnalyzing(false)
    onResultsChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onResultsChange])

  const handleRemoveImage = useCallback(() => {
    setFile(null)
    setOriginalPreviewUrl(null)
    setCurrentStep(0)
    onResultsChange(null)
     if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onResultsChange])

  return (
    <div>
      <Stepper currentStep={currentStep} />

      {!originalPreviewUrl ? (
        <div
          className={`max-w-lg mx-auto border-2 border-dashed rounded-xl p-10 text-center mb-5 cursor-pointer transition-all duration-300 relative ${
            isDragActive ? "border-green-600 bg-green-50" : "border-gray-300 hover:border-green-600 hover:bg-green-50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-5xl text-green-600 mb-4">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Drop image here</h3>
            <p className="text-sm text-gray-500">or click to browse files from your device</p>
          </div>
          <div className="flex justify-center gap-2">
            <span className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">JPEG</span>
            <span className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">JPG</span>
            <span className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">PNG</span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="relative max-w-lg mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
          <Image
            src={originalPreviewUrl}
            alt="Snake image preview"
            width={400}
            height={300}
            className="w-full h-auto max-h-80 object-contain rounded-xl"
          />
          <div className="absolute top-3 right-3">
            <div
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-red-500 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md relative ${
            isAnalyzing || currentStep !== 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white hover:-translate-y-0.5 hover:shadow-lg"
          }`}
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing || currentStep !== 1}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <>
              <i className="fas fa-search"></i>
              <span>Classify Snake</span>
            </>
          )}
        </button>
        <button
          className="px-6 py-3 rounded-full font-semibold border-2 border-gray-300 text-gray-600 hover:border-gray-600 hover:text-gray-900 transition-all duration-300"
          onClick={handleReset}
        >
          <i className="fas fa-redo mr-2"></i>
          Reset
        </button>
      </div>
    </div>
  )
}
