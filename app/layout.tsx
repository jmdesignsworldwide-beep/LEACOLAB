import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";

import { siteConfig } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  // Sin ejes extra (SOFT/WONK): el default de Fraunces ya es crisp (WONK 0),
  // así el archivo variable pesa menos. opsz se mantiene por optical-sizing.
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Estética Avanzada`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.fullName,
  // ⚠️ noindex mientras el sitio está en construcción. RETIRAR EN TANDA 12.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "es_DO",
    title: `${siteConfig.name} — Estética Avanzada`,
    description: siteConfig.description,
    siteName: siteConfig.fullName,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Estética Avanzada`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6f2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${geist.variable}`}>
      <body className="min-h-svh bg-background text-foreground">
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
