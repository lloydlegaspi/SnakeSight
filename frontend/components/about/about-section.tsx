export default function AboutSection() {
  return (
    <section className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 md:text-2xl">
          <i className="fas fa-info-circle text-2xl text-sky-700"></i> About SnakeSight
        </h2>
      </div>
      <div className="space-y-4 text-sm text-slate-700 md:text-base">
        <p>
          SnakeSight is an AI-powered Philippine snake identification system designed for medical professionals,
          toxicologists, and emergency responders. The core model, AttenDenseNet, is a DenseNet architecture enhanced
          with a Convolutional Block Attention Module (CBAM) to improve clinically useful feature focus.
        </p>
        <p>
          The current deployment scope includes fourteen terrestrial species: six medically important venomous species
          and eight non-venomous look-alikes commonly misidentified during first-contact assessments.
        </p>

        <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 p-4">
          <p className="text-slate-900">
            <strong>Safety Limitation:</strong> SnakeSight is decision-support only and must not replace expert
            diagnosis. Always prioritize emergency medical protocols, local wildlife authorities, and clinical judgment,
            especially when predictions are uncertain or species may be out of scope.
          </p>
        </div>
      </div>
    </section>
  )
}
