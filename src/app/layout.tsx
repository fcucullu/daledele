import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ServiceWorkerRegister } from "@/components/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daledele.franciscocucullu.com"),
  title: "DaleDele",
  description: "Practica español DELE B2",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "DaleDele" },
  other: { google: "notranslate" },
  openGraph: {
    title: "Dale Dele",
    description: "Practicá español para el DELE B2: subjuntivo, pasados, ser/estar y más con ejercicios interactivos.",
    url: "https://daledele.franciscocucullu.com",
    siteName: "Dale Dele",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dale Dele",
    description: "Practicá español para el DELE B2: subjuntivo, pasados, ser/estar y más con ejercicios interactivos.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#E8590C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" translate="no" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <ServiceWorkerRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
