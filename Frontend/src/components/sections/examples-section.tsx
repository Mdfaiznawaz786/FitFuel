import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { BookOpen, HeartPulse, ShoppingBasket } from "lucide-react"

const examples = [
  {
    icon: HeartPulse,
    title: "Keep health details together",
    description: "Profile and medical history",
    detail: "Record the measurements, conditions, medications, and food considerations you choose to enter.",
  },
  {
    icon: BookOpen,
    title: "Make a plan you can revisit",
    description: "Generated and saved diets",
    detail: "Generate a draft meal plan, edit it, and find it again in your diet history.",
  },
  {
    icon: ShoppingBasket,
    title: "Shop with a list",
    description: "Grocery search and receipts",
    detail: "Add foods to your shopping list, open store search links, and record what you spent afterward.",
  },
]

export default function ExamplesSection() {
  return (
    <section id="examples" className="w-full bg-muted/30 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Examples</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What you can do with FitFuel</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">A practical path from your profile to a saved plan and grocery list.</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {examples.map((example) => (
            <Card key={example.title} className="border-muted bg-background/60 shadow-sm">
              <CardHeader>
                <example.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{example.detail}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
