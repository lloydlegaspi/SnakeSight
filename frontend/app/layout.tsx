import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "SnakeSight",
  description: "AI-Powered Philippine Snake Detection",
  icons: {
    icon: "/img/snakesight-logo.png",
    shortcut: "/img/snakesight-logo.png",
    apple: "/img/snakesight-logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-background text-foreground leading-relaxed">
        <div className="w-full px-4 pt-4 md:px-12 md:pt-6 lg:px-24">
          <Header />
        </div>
        <main className="w-full flex-1">{children}</main>
        <div className="w-full px-4 pb-4 md:px-12 md:pb-6 lg:px-24">
          <Footer />
        </div>
      </body>
    </html>
  )
}
