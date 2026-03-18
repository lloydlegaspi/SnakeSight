"use client"

import Accordion from "../accordion"
import { LIMITATIONS } from "@/data/limitations"

export default function LimitationsSection() {
  return (
    <Accordion title="Limitations" icon="fas fa-exclamation-circle">
      <p className="mb-4 text-sm text-gray-700">
        SnakeSight has important safety and deployment limitations to account for before operational use:
      </p>
      <ul className="ml-5 list-disc space-y-2 text-sm text-gray-700">
        {LIMITATIONS.map((item) => (
          <li key={item.id}>
            <strong>{item.text.split(":")[0]}:</strong>
            {item.text.split(":")[1]}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-900">
        In potential snakebite emergencies, treat this tool as supporting context only. Final decisions must come from
        qualified clinicians and official protocols.
      </div>
    </Accordion>
  )
}
