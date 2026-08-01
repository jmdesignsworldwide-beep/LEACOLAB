import type { Metadata } from "next";

import { getContenido, type DiagnosticoContenido } from "@/lib/content";
import { DiagnosticoQuiz } from "@/components/diagnostico/quiz";

export const revalidate = 300;
export const metadata: Metadata = { title: "Diagnóstico de piel" };

export default async function DiagnosticoPage() {
  const intro = await getContenido<DiagnosticoContenido>("diagnostico");

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {intro?.kicker ?? "Diagnóstico de piel"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {intro?.titulo ?? "Descubre por dónde empezar"}
        </h1>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />

        <DiagnosticoQuiz intro={intro} />
      </section>
    </div>
  );
}
