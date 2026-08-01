import Image from "next/image";

import type { SantuarioContenido } from "@/lib/content";
import { urlPublica } from "@/lib/storage";
import { Reveal } from "@/components/reveal";

export function Santuario({
  contenido,
}: {
  contenido: SantuarioContenido | null;
}) {
  const img = urlPublica(contenido?.imagen_path);
  const hay = Boolean(contenido?.titulo || contenido?.parrafo || img);

  return (
    <section className="bl-grain relative overflow-hidden bg-bl-marble/60">
      <div className="container grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
        {/* Imagen del espacio */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-bl-marble">
            {img ? (
              <Image
                src={img}
                alt={contenido?.titulo ?? ""}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="bl-rule w-10 opacity-60" />
                <p className="px-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Fotografía del espacio en preparación
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Texto */}
        <div>
          {contenido?.kicker && (
            <Reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {contenido.kicker}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h2 className="mt-4 max-w-md text-fluid-2xl">
              {contenido?.titulo ?? "El santuario"}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="bl-rule mt-6 w-12 opacity-70" />
          </Reveal>
          {contenido?.parrafo ? (
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-fluid-base leading-relaxed text-muted-foreground">
                {contenido.parrafo}
              </p>
            </Reveal>
          ) : (
            !hay && (
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-sm text-muted-foreground">
                  Aquí vivirá la historia del espacio — su calidez, su calma. Se
                  carga desde el portal.
                </p>
              </Reveal>
            )
          )}
          {contenido?.lema && (
            <Reveal delay={0.28}>
              <p className="mt-8 font-display text-fluid-lg tracking-wide text-bl-charcoal">
                {contenido.lema}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
