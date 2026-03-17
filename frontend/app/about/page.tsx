import AboutSection from "@/components/about/about-section"
import HowToUseSection from "@/components/about/how-to-use-section"
import SpeciesInScopeSection from "@/components/about/species-in-scope-section"
import LimitationsSection from "@/components/about/limitations-section"

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <AboutSection />
      <HowToUseSection />
      <SpeciesInScopeSection />
      <LimitationsSection />
    </div>
  )
}
