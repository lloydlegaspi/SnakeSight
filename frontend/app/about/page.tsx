import AboutSection from "@/components/about/about-section"
import HowToUseSection from "@/components/about/how-to-use-section"
import SpeciesInScopeSection from "@/components/about/species-in-scope-section"
import LimitationsSection from "@/components/about/limitations-section"

export default function AboutPage() {
  return (
    <main className="w-full space-y-6 px-4 py-6 md:px-12 md:py-8 lg:px-24">


      <AboutSection />
      <HowToUseSection />
      <SpeciesInScopeSection />
      <LimitationsSection />
    </main>
  )
}
