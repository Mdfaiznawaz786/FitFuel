import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PricingSection() {
  const plans = [
    {
      name: "Basic",
      description: "For individuals starting their health journey",
      price: "$29",
      popular: false,
      features: ["Basic medical report analysis", "Monthly diet plan updates", "50+ recipes"],
    },
    {
      name: "Premium",
      description: "For those serious about health improvement",
      price: "$49",
      popular: true,
      features: [
        "Advanced medical report analysis",
        "Bi-weekly diet plan updates",
        "200+ recipes",
        "Nutritionist chat support",
      ],
    },
    {
      name: "Ultimate",
      description: "For comprehensive health management",
      price: "$79",
      popular: false,
      features: [
        "Comprehensive medical analysis",
        "Weekly diet plan updates",
        "Unlimited recipes",
        "1-on-1 nutritionist consultations",
        "Progress tracking dashboard",
      ],
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Pricing Plans
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Plan</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Select the plan that fits your health journey
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-background/60 backdrop-blur-sm transition-all duration-200 ${
                plan.popular ? "border-primary shadow-lg relative" : "border-muted shadow-sm hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-4 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 text-4xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full rounded-full ${plan.popular ? "" : "bg-primary/90 hover:bg-primary"}`}
                  variant={plan.popular ? "default" : "default"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

