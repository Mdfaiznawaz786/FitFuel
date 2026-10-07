import type { Metadata } from "next";
import "./globals.css";
import { ConditionalSidebar } from "@/components/conditionalSidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toast-provider";
import { AuthCheck } from "@/utils/auth";
import  AdminPanelLayout  from "@/components/admin-panel/admin-panel-layout";

export const metadata: Metadata = {
  title: "FitFuel",
  description: "Generate personalized diet plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ConditionalSidebar> <AuthCheck>{children}</AuthCheck>
            <ToasterProvider />
          </ConditionalSidebar>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
