"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="flex justify-between items-center bg-white px-5 py-4 shadow-md mb-5 max-md:flex-col max-md:gap-4">
      <div className="flex items-center gap-4">
        <i className="fas fa-snake text-3xl text-green-600"></i>
        <div>
          <h1 className="text-2xl font-bold mb-1 text-green-600">Philippine Snake Classification System</h1>
          <span className="text-sm text-gray-500">AI-powered snake identification system</span>
        </div>
      </div>

      <nav className="flex gap-5 max-md:w-full max-md:justify-center">
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
            pathname === "/" ? "text-green-600 bg-green-50" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-home"></i>
          Home
        </Link>
        <Link
          href="/test-mode"
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
            pathname === "/test-mode" ? "text-green-600 bg-green-50" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-vial"></i>
          Test Mode
        </Link>
        <Link
          href="/about"
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
            pathname === "/about" ? "text-green-600 bg-green-50" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-info-circle"></i>
          About
        </Link>
      </nav>
    </header>
  )
}
