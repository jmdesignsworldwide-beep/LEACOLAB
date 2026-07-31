import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Transformaciones" };

export default function TransformacionesPage() {
  return (
    <PlaceholderSection
      kicker="Transformaciones"
      title="Resultados reales en el tiempo"
      description="Galería antes/después con línea de tiempo por semana de tratamiento. En construcción — Tanda 7."
    />
  );
}
