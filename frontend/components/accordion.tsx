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
    <div className="mb-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div
        className="flex cursor-pointer items-center justify-between bg-white p-6 transition-colors duration-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <i className={`${icon} text-blue-900 text-2xl`}></i> {title}
        </h2>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-sm bg-gray-200 transition-all duration-300 ${
            isOpen ? "rotate-180 bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-300"
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
