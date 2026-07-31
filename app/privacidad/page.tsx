import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <PlaceholderSection
      kicker="Política de privacidad"
      title="Tus datos, protegidos"
      description="Conforme a la Ley 172-13 de Protección de Datos Personales de República Dominicana. El texto completo se publica antes del lanzamiento (Tanda 12)."
    />
  );
}
