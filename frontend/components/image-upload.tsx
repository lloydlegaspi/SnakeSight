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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file.")
      return
    }

    setErrorMessage(null)
    setFile(selectedFile)
    setCurrentStep(selectedFile ? 1 : 0)
    onResultsChange(null)

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
      setErrorMessage(null)
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
      setCurrentStep(1)
      onResultsChange(null)
      return
    }

    setErrorMessage("Only image files are supported.")
  }, [onResultsChange])

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

    setErrorMessage(null)
    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const apiUrl = `${apiBaseUrl}/predict`

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let message = `Server error: ${response.status}`
        try {
          const errorPayload = await response.json()
          if (errorPayload?.detail) {
            message = String(errorPayload.detail)
          }
        } catch {
          // Keep fallback message when non-JSON payload is returned.
        }
        throw new Error(message)
      }

      const data = await response.json()
      onResultsChange(data)
      setCurrentStep(2)
    } catch (err) {
      console.error("Prediction failed:", err)
      setErrorMessage(err instanceof Error ? err.message : "Prediction failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }, [file, onResultsChange])

  const handleReset = useCallback(() => {
    setFile(null)
    setOriginalPreviewUrl(null)
    setCurrentStep(0)
    setIsAnalyzing(false)
    setErrorMessage(null)
    onResultsChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onResultsChange])

  const handleRemoveImage = useCallback(() => {
    setFile(null)
    setOriginalPreviewUrl(null)
    setCurrentStep(0)
    setErrorMessage(null)
    onResultsChange(null)
     if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onResultsChange])

  return (
    <div>
      <Stepper currentStep={currentStep} />

      {errorMessage && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <i className="fas fa-triangle-exclamation mr-2"></i>
          {errorMessage}
        </div>
      )}

      {!originalPreviewUrl ? (
        <div
          className={`relative mx-auto mb-5 max-w-lg cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition-all duration-300 md:p-10 ${
            isDragActive ? "border-sky-600 bg-sky-50" : "border-slate-300 hover:border-sky-600 hover:bg-sky-50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="mb-4 text-5xl text-sky-700">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Drop image here</h3>
            <p className="text-sm text-slate-500">or click to browse files from your device</p>
          </div>
          <div className="flex justify-center gap-2">
            <span className="rounded-sm bg-slate-200 px-3 py-1 text-xs text-slate-700">JPEG</span>
            <span className="rounded-sm bg-slate-200 px-3 py-1 text-xs text-slate-700">JPG</span>
            <span className="rounded-sm bg-slate-200 px-3 py-1 text-xs text-slate-700">PNG</span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="relative mx-auto mb-6 max-w-lg overflow-hidden rounded-md border border-slate-200 shadow-sm">
          <Image
            src={originalPreviewUrl}
            alt="Snake image preview"
            width={400}
            height={300}
            className="h-auto max-h-80 w-full rounded-md object-contain"
          />
          <div className="absolute top-3 right-3">
            <div
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm bg-white/85 text-red-500 transition-all duration-300 hover:scale-105 hover:bg-white"
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
        <button
          className={`relative flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold transition-all duration-300 shadow-md ${
            isAnalyzing || currentStep !== 1
              ? "cursor-not-allowed bg-slate-300 text-slate-600"
              : "bg-sky-700 text-white hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
          }`}
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing || currentStep !== 1}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border-2 border-white/30 border-t-white animate-spin"></div>
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
          className="rounded-md border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-all duration-300 hover:border-slate-500 hover:text-slate-900"
          onClick={handleReset}
        >
          <i className="fas fa-redo mr-2"></i>
          Reset
        </button>
      </div>
    </div>
  )
}
