export default function Footer() {
  return (
    <footer className="rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm md:px-6 md:py-4">
      <div className="flex flex-col gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <p className="text-xs font-bold md:text-sm">SnakeSight © 2026 | Clinical Decision Support Platform</p>
        <p className="text-xs md:max-w-2xl md:text-sm">
          Decision-support only. Always follow clinical guidance, emergency response protocols, and local wildlife
          safety procedures.
        </p>
      </div>
    </footer>
  )
}
