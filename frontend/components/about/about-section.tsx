export default function AboutSection() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <i className="fas fa-info-circle text-green-600 text-2xl"></i> About the System
        </h2>
      </div>
      <div className="space-y-4 text-gray-700 text-sm">
        <p>
          The Philippine Snake Classification System is an AI-powered tool designed primarily for medical applications.
          It helps to identify snake species from images, particularly to determine if a snake is venomous or
          non-venomous. This can be crucial information when someone has been bitten by a snake and medical
          professionals need to quickly identify the species to provide appropriate treatment.
        </p>
        <p>
          This system is focused specifically on Philippine snake species, with a limited scope of fourteen terrestrial
          species: six medically important venomous species as classified by the World Health Organization, and eight
          non-venomous look-alikes that are often confused with their venomous counterparts.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <p className="text-gray-900">
            <strong>Important:</strong> This tool is intended as a clinical decision support system only. Always use
            clinical judgment and follow established protocols for snakebite treatment. The system cannot identify
            species outside the fourteen species it was trained on.
          </p>
        </div>
      </div>
    </div>
  )
}
