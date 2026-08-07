import type { Metadata } from "next";
import { Star } from "lucide-react";

import { getResenas } from "@/lib/resenas";
import { getContenido, type SeccionEncabezado } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const revalidate = 300;
export const metadata: Metadata = { title: "Reseñas" };

export default async function ResenasPage() {
  const [intro, resenas] = await Promise.all([
    getContenido<SeccionEncabezado>("resenas_intro"),
    getResenas(),
  ]);

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {intro?.kicker ?? "Reseñas"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {intro?.titulo ?? "Lo que dicen nuestras pacientes"}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-1" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-5 fill-bl-gold text-bl-gold" />
          ))}
        </div>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
      </section>

      {resenas.length === 0 ? (
        <section className="container mt-12">
          <div className="mx-auto max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Las reseñas se publican desde el portal y aparecerán aquí. Mientras
              tanto, puedes leerlas en nuestra agenda.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
                  Ver reseñas en la agenda
                </a>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="container mt-14">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resenas.map((r, i) => (
              <Reveal key={r.id} delay={0.05 * (i % 3)}>
                <figure className="flex h-full flex-col rounded-lg border border-border bg-background p-6">
                  {r.rating && (
                    <div className="flex gap-0.5" aria-label={`${r.rating} de 5`}>
                      {Array.from({ length: r.rating }).map((_, k) => (
                        <Star key={k} className="size-4 fill-bl-gold text-bl-gold" aria-hidden />
                      ))}
                    </div>
                  )}
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                    “{r.texto}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-medium text-bl-charcoal">
                    {r.autor}
                    {r.fuente && (
                      <span className="font-normal text-muted-foreground"> · {r.fuente}</span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
