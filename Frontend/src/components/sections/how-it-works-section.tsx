export default function HowItWorksSection() {
    const steps = [
      {
        number: 1,
        title: "Upload Your Data",
        description: "Upload your medical Data and health data through our platform.",
      },
      {
        number: 2,
        title: "AI Analysis",
        description: "Our advanced AI analyzes your data to identify nutritional needs and health considerations.",
      },
      {
        number: 3,
        title: "Receive Your Plan",
        description: "Get your personalized nutrition plan with meal suggestions, recipes, and shopping lists.",
      },
    ]
  
    return (
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              Simple Process
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Three simple steps to your personalized nutrition plan
              </p>
            </div>
          </div>
  
          <div className="relative mx-auto max-w-5xl py-12">
            {/* Connection line */}
            {/* <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border md:block hidden"></div> */}
  
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 text-center relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-lg z-10">
                    {step.number}
                  </div>
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
  
  