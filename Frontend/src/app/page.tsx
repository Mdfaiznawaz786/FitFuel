import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import PricingSection from "@/components/sections/pricing-section"
import CtaSection from "@/components/sections/cta-section"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background justify-center items-center">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

