"use client"

import Accordion from "../accordion"
import { LIMITATIONS } from "@/data/limitations"

export default function LimitationsSection() {
  return (
    <Accordion title="Limitations" icon="fas fa-exclamation-circle">
      <p className="text-sm text-gray-700 mb-4">
        The Philippine Snake Classification System has several important limitations to be aware of:
      </p>
      <ul className="ml-5 list-disc space-y-2 text-sm text-gray-700">
        {LIMITATIONS.map((item) => (
          <li key={item.id}>
            <strong>{item.text.split(":")[0]}:</strong>
            {item.text.split(":")[1]}
          </li>
        ))}
      </ul>
    </Accordion>
  )
}
