"use client"

interface StepperProps {
  currentStep: number
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { number: 1, label: "Upload" },
    { number: 2, label: "Analyze" },
    { number: 3, label: "Results" },
  ]

  return (
    <div className="flex items-center mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex-1 text-center relative">
          <div
            className={`relative z-10 mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-sm text-sm font-semibold ${
              index < currentStep
                ? "bg-blue-100 text-blue-900"
                : index === currentStep
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {step.number}
          </div>
          <div className={`text-xs ${index === currentStep ? "text-blue-900 font-semibold" : "text-gray-500"}`}>
            {step.label}
          </div>
          {/* Progress line */}
          {index < steps.length - 1 && (
            <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-0">
              <div
                className={`h-full transition-all duration-300 ${
                  index < currentStep ? "bg-blue-900 w-full" : "bg-gray-200 w-0"
                }`}
              />
            </div>
          )}
          {index === 0 && (
            <div className="absolute top-4 left-3/4 w-1/2 h-0.5 bg-gray-200 -z-0">
              <div
                className={`h-full transition-all duration-300 ${
                  currentStep > 0 ? "bg-blue-900 w-full" : "bg-gray-200 w-0"
                }`}
              />
            </div>
          )}
          {index === steps.length - 1 && (
            <div className="absolute top-4 right-3/4 w-1/2 h-0.5 bg-gray-200 -z-0">
              <div
                className={`h-full transition-all duration-300 ${
                  currentStep > 1 ? "bg-blue-900 w-full" : "bg-gray-200 w-0"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
