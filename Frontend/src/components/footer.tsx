import Link from "next/link"
import { Salad } from "lucide-react"

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
  { label: "Current access", href: "#pricing" },
]

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 px-4 py-10">
      <div className="container mx-auto flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2"><Salad className="h-6 w-6 text-primary" /><span className="text-lg font-bold">FitFuel</span></div>
          <p className="max-w-md text-sm text-muted-foreground">Draft diet plans, a saved health profile, and a grocery list you can take to a store.</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} FitFuel</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">{link.label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}
