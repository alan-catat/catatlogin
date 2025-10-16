// app/layout.tsx
import "./globals.css"
import { Outfit } from "next/font/google"

import { SidebarProvider } from "@/context/SidebarContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { createClient } from "@/utils/supabase/server"
import type { Metadata } from "next"

const outfit = Outfit({ subsets: ["latin"] })

// 🟢 ambil metadata dari Supabase
export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient()

  // ambil 2 setting sekaligus
  const { data, error } = await (await supabase)
    .from("system_settings")
    .select("key, value")
    .in("key", ["APP_NAME", "LOGO_FAVICON"])

  if (error) {
    console.error("Error fetching system settings:", error.message)
  }

  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))

  return {
    title: settings.APP_NAME ?? "Default App",
    description: "Auto extract financial documents",
    icons: {
      icon: settings.LOGO_FAVICON ?? "/favicon.ico",
    },
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
