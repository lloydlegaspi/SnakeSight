"use client"

import Accordion from "../accordion"
import SnakeCard from "../snake-card"
import { VENOMOUS_SPECIES, NON_VENOMOUS_SPECIES } from "@/data/species"

export default function SpeciesInScopeSection() {
  return (
    <Accordion title="Species in Scope" icon="fas fa-clipboard-list">
      <p className="text-sm text-gray-700 mb-6">
        The system is trained to classify the following fourteen Philippine snake species. These include six venomous
        species and eight non-venomous look-alikes selected based on their morphological similarities and geographic
        overlap.
      </p>

      {/* Venomous Species */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 mb-4">
          <i className="fas fa-exclamation-triangle"></i> Venomous Species
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VENOMOUS_SPECIES.map((species, index) => (
            <SnakeCard key={index} species={species} />
          ))}
        </div>
      </div>

      {/* Non-venomous Species */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-sky-700">
          <i className="fas fa-check-circle"></i> Non-venomous Species
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NON_VENOMOUS_SPECIES.map((species, index) => (
            <SnakeCard key={index} species={species} />
          ))}
        </div>
      </div>
    </Accordion>
  )
}
