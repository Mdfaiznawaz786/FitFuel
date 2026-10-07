"use client";

import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

export function SheetMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  // Close sheet when pathname changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative z-50"> {/* Added relative positioning with high z-index */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            className="h-8 flex lg:hidden" 
            variant="outline" 
            size="icon"
          >
            <MenuIcon size={20} />
          </Button>
        </SheetTrigger>
        
        <SheetContent className="sm:w-72 px-3 h-full flex flex-col z-50" side="left">
          <SheetHeader>
            <Button
              className="flex justify-center items-center pb-2 pt-1"
              variant="link"
              asChild
            >
              <Link href="/progress" className="flex items-center gap-2">
                <PanelsTopLeft className="w-6 h-6 mr-1" />
                <SheetTitle className="font-bold text-lg">FitFuel</SheetTitle>
              </Link>
            </Button>
          </SheetHeader>
          <Menu isOpen={true} />
        </SheetContent>
      </Sheet>
    </div>
  );
}