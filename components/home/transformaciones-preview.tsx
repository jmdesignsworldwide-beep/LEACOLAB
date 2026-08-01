import Link from "next/link";

import type { CasoGaleria } from "@/lib/casos";
import type { SeccionEncabezado } from "@/lib/content";
import { BLUR_MARBLE } from "@/lib/blur";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/before-after";

export function TransformacionesPreview({
  caso,
  encabezado,
}: {
  caso: CasoGaleria | null;
  encabezado: SeccionEncabezado | null;
}) {
  const antes = caso?.antes ?? null;
  const despues = caso?.despues ?? null;
  const hay = Boolean(antes && despues);

  return (
    <section className="bl-grain relative overflow-hidden bg-bl-marble/60">
      <div className="container grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
        {/* Slider a la izquierda en desktop */}
        <Reveal>
          {hay ? (
            <BeforeAfter antes={antes!} despues={despues!} blurDataURL={BLUR_MARBLE} />
          ) : (
            <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bl-marble text-center">
              <div className="bl-rule w-10 opacity-60" />
              <p className="mt-4 px-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Transformaciones en preparación
              </p>
            </div>
          )}
        </Reveal>

        {/* Texto */}
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {encabezado?.kicker ?? "Transformaciones"}
            </p>
          </Reveal>
          {encabezado?.titulo && (
            <Reveal delay={0.08}>
              <h2 className="mt-4 max-w-md text-fluid-2xl">
                {encabezado.titulo}
              </h2>
            </Reveal>
          )}
          <Reveal delay={0.16}>
            <div className="bl-rule mt-6 w-12 opacity-70" />
          </Reveal>
          {hay && caso && (
            <Reveal delay={0.2}>
              <p className="mt-6 text-sm text-muted-foreground">
                {[
                  caso.condicion,
                  caso.semana_tratamiento
                    ? `Semana ${caso.semana_tratamiento} de tratamiento`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.28}>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/transformaciones">
                  {encabezado?.cta_texto ?? "Ver transformaciones"}
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
