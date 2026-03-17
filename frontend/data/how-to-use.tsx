import type { ReactNode } from "react"

export interface HowToUseStep {
  number: number
  title: string
  description: ReactNode
}

export const HOW_TO_USE_STEPS: HowToUseStep[] = [
  {
    number: 1,
    title: "Upload an Image",
    description: (
      <p className="text-sm text-gray-700">
        Click on the upload area or drag and drop an image of the snake. The system accepts PNG, JPG, or JPEG formats.
        For best results, use a clear, well-lit image showing as much of the snake as possible.
      </p>
    ),
  },
  {
    number: 2,
    title: "Analyze the Image",
    description: (
      <p className="text-sm text-gray-700">
        After uploading, click the "Classify Snake" button to begin the analysis. The system will process the image
        using an AI model specifically trained on Philippine snake species.
      </p>
    ),
  },
  {
    number: 3,
    title: "Review Results",
    description: (
      <div className="text-sm text-gray-700">
        The system will display the predicted snake species along with:
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li>Scientific name</li>
          <li>Family name</li>
          <li>Venomous status (venomous or non-venomous)</li>
          <li>Confidence score of the prediction</li>
          <li>Alternative possible species with their respective confidence scores</li>
          <li>Brief descriptions of each identified species</li>
        </ul>
      </div>
    ),
  },
]
