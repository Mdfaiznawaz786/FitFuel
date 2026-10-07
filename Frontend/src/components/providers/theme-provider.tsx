"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use this to prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  

  // After mounting, we have access to the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering children until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}