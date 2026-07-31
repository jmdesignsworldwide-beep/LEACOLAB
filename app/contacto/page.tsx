import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  return (
    <PlaceholderSection
      kicker="Contacto"
      title="Hablemos de tu piel"
      description="Formulario, WhatsApp, ubicación y horario. En construcción — Tanda 10."
    />
  );
}
