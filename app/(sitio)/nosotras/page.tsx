import type { Metadata } from "next";

import { PlaceholderSection } from "@/components/placeholder-section";

export const metadata: Metadata = { title: "Nosotras" };

export default function NosotrasPage() {
  return (
    <PlaceholderSection
      kicker="Nosotras"
      title="Marianny y su equipo de especialistas"
      description="La historia, la misión y las expertas que las clientas ya piden por nombre. En construcción — Tanda 5."
    />
  );
}
