import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Protocolos" };

export default function ProtocolosPage() {
  return (
    <PlaceholderSection
      kicker="Protocolos"
      title="Procesos, no citas sueltas"
      description="Cada protocolo con sus fases, qué incluye y una inversión transparente. En construcción — Tanda 6."
    />
  );
}
