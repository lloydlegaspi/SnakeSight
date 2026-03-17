"use client"

import type React from "react"
import { useState } from "react"

interface AccordionProps {
  title: string | React.ReactNode
  icon: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function Accordion({ title, icon, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
      <div
        className="flex items-center justify-between p-6 bg-white cursor-pointer transition-colors duration-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <i className={`${icon} text-green-600 text-2xl`}></i> {title}
        </h2>
        <div
          className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center transition-all duration-300 ${
            isOpen ? "rotate-180 bg-green-100 text-green-600" : "text-gray-600 hover:bg-gray-300"
          }`}
        >
          <i className="fas fa-chevron-down text-sm"></i>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[9999px] opacity-100 p-6 border-t border-gray-200" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
