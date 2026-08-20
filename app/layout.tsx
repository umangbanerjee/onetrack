import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OneTrack — Precision Job Search Command Center",
  description:
    "A terminal-grade, config-driven Progressive Web App to log job applications in seconds, track interview pipelines, and visualize application velocity.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OneTrack",
  },
};

export const viewport: Viewport = {
  themeColor: "#201d1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
        <body className="font-mono min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <OfflineBanner />
            <PwaRegister />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: "font-mono border border-border text-foreground text-xs rounded-sm bg-card shadow-none",
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
