"use client";

import { usePathname } from "next/navigation";
;
import  AdminPanelLayout  from "@/components/admin-panel/admin-panel-layout";

export function ConditionalSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const starterPagePath = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup");
  
  if (!starterPagePath) {
    return (
        <AdminPanelLayout>{children}</AdminPanelLayout>
    );
  }
  
  // Don't render sidebar components on patch/ routes
  return <div >{children}</div>;
}