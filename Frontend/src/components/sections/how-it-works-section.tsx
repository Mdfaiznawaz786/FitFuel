const steps = [
  {
    number: 1,
    title: "Enter Your Details",
    description: "Add your measurements, health conditions, and food preferences to your profile.",
  },
  {
    number: 2,
    title: "Generate a Draft Plan",
    description: "Generate a draft diet plan using the information you provide.",
  },
  {
    number: 3,
    title: "Receive Your Plan",
    description: "Review and save your plan, then build a grocery list and track your own progress.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Simple Process</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">Three steps to a plan you can review and use.</p>
        </div>
        <div className="relative mx-auto max-w-5xl py-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center space-y-4 text-center">
                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">{step.number}</div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
