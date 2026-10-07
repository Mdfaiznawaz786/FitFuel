/* eslint-disable react/jsx-no-undef */
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Menu as SidebarMenu } from "@/components/admin-panel/menu";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile title bar - fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-background/95 shadow backdrop-blur z-40 flex items-center justify-center lg:hidden">
        <h1 className="text-lg font-serif font-semibold">FitFuel</h1>
      </div>
      
      {/* Menu button and sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-3 left-4 z-50 lg:hidden bg-background/80 backdrop-blur"
          >
            <Menu className="h-5 w-5" />
            <VisuallyHidden>Open menu</VisuallyHidden>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-[270px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="font-bold text-lg">FitFuel</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto py-2">
            <SidebarMenu isOpen={true} />
          </div>
      </SheetContent>
    </Sheet>
    </>
  );
}