import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Quote } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah T.",
      title: "Diabetes Management",
      quote:
        "After uploading my lab results, NutriAI created a meal plan that helped stabilize my blood sugar levels. My A1C has improved significantly in just 3 months!",
    },
    {
      name: "Michael R.",
      title: "Cholesterol Reduction",
      quote:
        "The personalized diet plan helped me lower my LDL cholesterol by 30 points in 6 months. My doctor was amazed at the improvement!",
    },
    {
      name: "Jennifer K.",
      title: "Autoimmune Support",
      quote:
        "Living with an autoimmune condition made eating difficult. NutriAI created an anti-inflammatory diet plan that reduced my flare-ups and improved my energy levels.",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Success Stories
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Real results from real people using our AI-powered nutrition plans
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-background/60 backdrop-blur-sm border-muted shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardHeader>
                <Quote className="h-8 w-8 text-primary/40 mb-2" />
                <CardTitle>{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">{testimonial.quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


