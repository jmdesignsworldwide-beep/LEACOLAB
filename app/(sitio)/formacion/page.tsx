import type { Metadata } from "next";

import { getProgramas } from "@/lib/formacion";
import { getContenido, type SeccionEncabezado } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ProgramaCard } from "@/components/formacion/programa-card";
import { InscripcionForm } from "@/components/formacion/inscripcion-form";

export const revalidate = 300;
export const metadata: Metadata = { title: "Formación" };

export default async function FormacionPage() {
  const [intro, programas] = await Promise.all([
    getContenido<SeccionEncabezado>("formacion_intro"),
    getProgramas(),
  ]);

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {intro?.kicker ?? "Formación"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {intro?.titulo ?? "Conviértete en especialista"}
        </h1>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
      </section>

      {programas.length === 0 ? (
        <section className="container mt-12">
          <div className="mx-auto max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Los programas de formación se publican desde el portal y aparecerán
              aquí. Mientras tanto, puedes dejarnos tus datos y te avisamos.
            </p>
          </div>
        </section>
      ) : (
        <section className="container mt-14">
          <div className="grid gap-6 md:grid-cols-2">
            {programas.map((p, i) =>
              // Primer pliegue: visible y con priority para no bloquear el LCP.
              i < 2 ? (
                <ProgramaCard key={p.id} programa={p} prioridad />
              ) : (
                <Reveal key={p.id} delay={0.06 * (i - 2)}>
                  <ProgramaCard programa={p} />
                </Reveal>
              )
            )}
          </div>
        </section>
      )}

      <section className="container mt-16">
        <div className="mx-auto max-w-2xl">
          <InscripcionForm
            programas={programas.map((p) => ({ id: p.id, nombre: p.nombre }))}
          />
        </div>
      </section>
    </div>
  );
}
