import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Diagnóstico de Piel" };

export default function DiagnosticoPage() {
  return (
    <PlaceholderSection
      kicker="Diagnóstico de Piel"
      title="Tu punto de partida, en 2 minutos"
      description="El diagnóstico interactivo que te sugiere un protocolo a tu medida. La pieza estrella del sitio. En construcción — Tanda 8."
    />
  );
}
