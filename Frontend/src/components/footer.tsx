import Link from "next/link"
import { Salad } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Careers", href: "#careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "HIPAA Compliance", href: "#hipaa" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact", href: "#contact" },
        { name: "Community", href: "#community" },
      ],
    },
  ]

  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm p-4">
      <div className="container flex flex-col gap-8 py-12">
        <div className="mx-auto flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3 md:max-w-xs">
            <div className="flex items-center gap-2">
              <Salad className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">NutriAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered personalized nutrition plans based on your medical data. Transform your health with
              science-backed recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerLinks.map((category) => (
              <div key={category.title} className="space-y-3">
                <h3 className="text-sm font-medium">{category.title}</h3>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {currentYear} NutriAI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


