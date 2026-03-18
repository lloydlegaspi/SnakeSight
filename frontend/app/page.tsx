import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="w-full space-y-8 px-4 py-6 md:space-y-10 md:px-12 md:py-10 lg:px-24">
      <section className="relative overflow-hidden rounded-md border border-sky-200 bg-gradient-to-br from-sky-100 via-white to-cyan-100 p-5 shadow-xl md:p-10">
        <div className="pointer-events-none absolute -left-24 -top-16 h-64 w-64 rounded-md bg-sky-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-md bg-blue-300/40 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-2 xl:items-center">
        <section className="space-y-8">
          
          {/* Flex container to place Logo and Text side-by-side */}
          <div className="flex items-center gap-4 md:gap-6 text-left">
            <Image
              src="/img/snakesight-logo.png"
              alt="SnakeSight official logo"
              width={220}
              height={220}
              // Added shrink-0 so the logo doesn't get squished on smaller screens
              className="h-auto w-24 shrink-0 drop-shadow-md md:w-32" 
              priority
            />
            
            {/* Wrapper for Title and Subtitle to keep them stacked together */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                <span className="text-blue-900 dark:text-blue-300">Snake</span>
                <span className="text-blue-800 dark:text-blue-100">Sight</span>
              </h1>
              <p className="text-lg font-medium text-slate-700 md:text-2xl">
                AI-Powered Philippine Snake Identification.
              </p>
            </div>
          </div>
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Powered by AttenDenseNet, SnakeSight helps clinicians, toxicologists, and first responders identify
              endemic Philippine snake species from images with explainable AI outputs.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/classification"
                className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-6 py-3 text-base font-bold text-white shadow-lg shadow-sky-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-800"
              >
                <i className="fas fa-camera"></i>
                Identify a Snake
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
              >
                Learn More
              </Link>
            </div>
          </section>

          <section className="rounded-md border border-sky-200 bg-white/90 p-5 shadow-lg backdrop-blur md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <i className="fas fa-bolt text-sky-600"></i>
              What SnakeSight Delivers
            </h2>
            <ul className="space-y-3 text-sm text-slate-700 md:text-base">
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle mt-1 text-sky-700"></i>
                Species prediction across 14 Philippine snakes.
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle mt-1 text-sky-700"></i>
                Venom risk stratification to support emergency antivenom routing.
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle mt-1 text-sky-700"></i>
                Results visualization for model interpretability.
              </li>
            </ul>
            <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 md:text-base">
              Intended for trained professionals in clinical and emergency workflows. Always follow institutional
              protocols and snakebite treatment guidelines.
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-md border border-sky-200 bg-white p-5 shadow-sm md:p-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">How It Works</h2>
        <p className="mt-2 text-slate-600 md:text-lg">A fast, three-step pipeline built for high-pressure clinical workflows.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-sky-100 bg-sky-50/60 p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-sky-700 text-sm font-bold text-white">
              1
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">Upload Photo</h3>
            <p className="mt-2 text-sm text-slate-700 md:text-base">
              Submit a clear snake image from triage teams, ambulance units, or emergency departments.
            </p>
          </article>

          <article className="rounded-md border border-sky-100 bg-sky-50/60 p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-sky-700 text-sm font-bold text-white">
              2
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">AI Analysis with AttenDenseNet</h3>
            <p className="mt-2 text-sm text-slate-700 md:text-base">
              The model evaluates species-level features and attention regions to support explainable clinical review.
            </p>
          </article>

          <article className="rounded-md border border-sky-100 bg-sky-50/60 p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-sky-700 text-sm font-bold text-white">
              3
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">Medical-Grade Output</h3>
            <p className="mt-2 text-sm text-slate-700 md:text-base">
              Receive species identification confidence with first aid and escalation guidance for rapid routing.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-gradient-to-r from-slate-900 via-sky-900 to-blue-900 p-6 text-white shadow-lg md:p-8">
        <h2 className="text-2xl font-black tracking-tight md:text-3xl">Trusted in Emergencies</h2>
        <p className="mt-3 text-sm text-sky-100 md:text-lg">
          SnakeSight is designed for care teams that need timely and defendable decision support under pressure.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-white/20 bg-white/10 p-4">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <i className="fas fa-truck-medical text-sky-200"></i>
              First Responders
            </h3>
            <p className="mt-2 text-sm text-sky-100">
              Supports scene-level triage and handoff quality before arrival to definitive care.
            </p>
          </article>

          <article className="rounded-md border border-white/20 bg-white/10 p-4">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <i className="fas fa-flask-vial text-sky-200"></i>
              Toxicologists
            </h3>
            <p className="mt-2 text-sm text-sky-100">
              Provides rapid species context to inform antivenom strategy and toxicity risk discussions.
            </p>
          </article>

          <article className="rounded-md border border-white/20 bg-white/10 p-4">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <i className="fas fa-user-doctor text-sky-200"></i>
              Medical Professionals
            </h3>
            <p className="mt-2 text-sm text-sky-100">
              Enhances emergency consult pathways with explainable AI outputs and consistent terminology.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-md border border-sky-300 bg-gradient-to-r from-sky-700 to-blue-800 p-6 text-white shadow-xl md:p-10">
        <h2 className="text-2xl font-black tracking-tight md:text-4xl">Ready to Launch the Scanner?</h2>
        <p className="mt-3 text-sm text-sky-100 md:text-lg">
          Start image-based assessment now and move from uncertainty to actionable snakebite support in seconds.
        </p>
        <div className="mt-6">
          <Link
            href="/classification"
            className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white px-6 py-3 text-base font-bold text-sky-900 transition-colors hover:bg-sky-100"
          >
            <i className="fas fa-play"></i>
            Launch Snake Scanner
          </Link>
        </div>
      </section>
    </main>
  )
}
