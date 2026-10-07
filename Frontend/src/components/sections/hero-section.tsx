import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit">
              Introducing NutriAI
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Personalized Diet Plans <br className="hidden sm:inline" />
                <span className="text-primary">Powered by AI</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Upload your medical  and health data. Our AI analyzes your unique needs and creates a customized
                nutrition plan for optimal health.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="#get-started">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <Link href="#learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-primary/50 opacity-30 blur-xl"></div>
            <Image
              src="/starterPagePhoto.svg?height=550&width=550"
              width={550}
              height={550}
              alt="AI Diet Planning Dashboard"
              className="relative z-10 mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center shadow-xl sm:w-full lg:aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

