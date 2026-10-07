import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  "Health profile and medical-history summary",
  "Generated, editable, and saved diet plans",
  "Shopping list with store search links",
  "Weight trend and recorded grocery spending",
]

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="inline-flex rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Current access</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Use the FitFuel preview</h2>
          <p className="text-muted-foreground md:text-xl/relaxed">FitFuel does not currently charge a subscription. Purchases on retailer websites are separate.</p>
        </div>
        <Card className="mx-auto mt-10 max-w-lg border-primary shadow-lg">
          <CardHeader>
            <CardTitle>FitFuel preview</CardTitle>
            <CardDescription>Explore the features available today.</CardDescription>
            <p className="pt-3 text-4xl font-bold">$0 <span className="text-sm font-normal text-muted-foreground">FitFuel subscription</span></p>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 shrink-0 text-primary" />{feature}</li>)}
            </ul>
          </CardContent>
          <CardFooter><Button asChild className="w-full rounded-full"><Link href="#get-started">Get started</Link></Button></CardFooter>
        </Card>
      </div>
    </section>
  )
}
