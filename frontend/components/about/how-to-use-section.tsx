"use client"

import Accordion from "../accordion"
import { HOW_TO_USE_STEPS } from "@/data/how-to-use"

export default function HowToUseSection() {
  return (
    <Accordion title="How to Use" icon="fas fa-question-circle">
      <p className="text-sm text-gray-700 mb-6">
        SnakeSight is designed for fast, structured use during field assessment and clinical intake, where early
        species identification can accelerate first-aid triage and antivenom pathway decisions.
      </p>

      <div className="space-y-5">
        {HOW_TO_USE_STEPS.map((step) => (
          <div key={step.number} className="flex items-start">
            <div className="mr-4 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-sky-100 text-base font-semibold text-sky-700">
              {step.number}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              {step.description}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6">
        <p className="text-gray-900 text-sm">
          <strong>Note:</strong> The quality of the image significantly affects the accuracy of the classification. When
          possible, provide clear images that show distinctive features of the snake.
        </p>
      </div>
    </Accordion>
  )
}
