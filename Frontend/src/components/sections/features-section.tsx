import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { FileText, Brain, Salad } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Medical Report Analysis",
      description: "Upload your medical reports and our AI will extract relevant health markers.",
      content:
        "Our system analyzes cholesterol levels, blood sugar, vitamin deficiencies, and other key health indicators.",
    },
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Advanced algorithms create personalized nutrition plans based on your data.",
      content: "Our AI considers your health conditions, allergies, dietary preferences, and nutritional needs.",
    },
    {
      icon: Salad,
      title: "Custom Meal Plans",
      description: "Receive weekly meal plans tailored to your specific health requirements.",
      content: "Get delicious recipes, shopping lists, and meal prep instructions designed for your health goals.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Key Features
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Smart Nutrition Tailored to Your Body
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered platform analyzes your medical data to create personalized diet plans that work with your
              unique health profile.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-background/60 backdrop-blur-sm border-muted shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

