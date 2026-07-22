import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Source_Serif_4, Geist_Mono } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UK Census Data",
  description: "Explore and visualise UK Census 2021 data by topic and region.",
  applicationName: "UK Census Data",
  appleWebApp: {
    capable: true,
    title: "UK Census",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2a6b6b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${sourceSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col font-sans"
      >
        <SiteShell>{children}</SiteShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
