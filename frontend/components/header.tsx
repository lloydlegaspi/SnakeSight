"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isClassification = pathname.startsWith("/classification") || pathname.startsWith("/test-mode")

  return (
    <header className="mb-4 flex items-start justify-between rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm max-md:flex-col max-md:gap-3">
      <div className="flex items-center gap-3">
        <Image
          src="/img/snakesight-logo.png"
          alt="SnakeSight logo"
          width={100}
          height={100}
          className="h-14 w-14 rounded-sm object-contain"
          priority
        />
        <div>
          <h1 className="mb-1 text-xl font-black text-slate-900 md:text-2xl">SnakeSight</h1>
          <span className="text-xs text-slate-500 md:text-sm">AI-powered Philippine snake identification</span>
        </div>
      </div>

      <nav className="flex w-full flex-wrap items-center justify-center gap-2 md:w-auto md:justify-end md:gap-3">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
            pathname === "/" ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fas fa-home"></i>
          Home
        </Link>
        <Link
          href="/classification"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
            isClassification ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fas fa-camera"></i>
          Classification
        </Link>
        <Link
          href="/about"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
            pathname === "/about" ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <i className="fas fa-info-circle"></i>
          About
        </Link>
      </nav>
    </header>
  )
}
