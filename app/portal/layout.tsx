import type { Metadata } from "next";

// ⚠️ noindex PERMANENTE del portal — INDEPENDIENTE del noindex global del sitio.
// Cuando en la Tanda 12 se retire el noindex global, ESTE NO SE TOCA: el panel
// de administración nunca debe ser indexable.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
