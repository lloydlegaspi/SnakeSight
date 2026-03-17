import Image from "next/image"
import type { SnakeSpecies } from "@/data/species"

interface SnakeCardProps {
  species: SnakeSpecies
}

export default function SnakeCard({ species }: SnakeCardProps) {
  const isVenomous = species.status === "Venomous"
  const bgColorClass = isVenomous ? "bg-red-50" : "bg-green-50"
  const textColorClass = isVenomous ? "text-red-600" : "text-green-600"
  const statusBgClass = isVenomous ? "bg-red-100" : "bg-green-100"

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className={`p-4 flex justify-between items-center ${bgColorClass}`}>
        <div>
          <h4 className={`text-base font-semibold ${textColorClass} mb-1`}>{species.name}</h4>
          <p className="text-xs italic text-gray-600">{species.scientificName}</p>
        </div>
        <span className={`text-xs font-bold ${textColorClass} ${statusBgClass} px-2 py-1 rounded-full`}>
          {species.status}
        </span>
      </div>
      <Image
        src={species.image || "/placeholder.svg"}
        alt={species.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-700 mb-3 flex-grow">{species.description}</p>
        <div className="text-xs text-gray-600 flex items-center mb-1">
          <i className="fas fa-tag w-4 mr-2 text-gray-700"></i>Family: {species.family}
        </div>
        {species.resembles && (
          <div className="text-xs text-gray-600 flex items-center">
            <i className="fas fa-copy w-4 mr-2 text-gray-700"></i>Resembles: {species.resembles}
          </div>
        )}
      </div>
    </div>
  )
}
