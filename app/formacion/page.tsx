import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Formación" };

export default function FormacionPage() {
  return (
    <PlaceholderSection
      kicker="Formación"
      title="Conviértete en experta"
      description="Mentorías y clases privadas de cosmetología y tricología con Leela. En construcción — Tanda 9."
    />
  );
}
