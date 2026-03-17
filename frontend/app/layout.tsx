import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Philippine Snake Classification System",
  description: "AI-powered snake identification system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-gray-100 text-gray-900 leading-relaxed">
        <Header />
        <div className="max-w-screen-xl mx-auto p-5">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
