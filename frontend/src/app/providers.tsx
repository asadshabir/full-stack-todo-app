"use client"

/**
 * Providers Component
 *
 * Wraps the application with necessary providers:
 * - ThemeProvider for theme management
 * - QueryClientProvider for TanStack Query
 */

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
