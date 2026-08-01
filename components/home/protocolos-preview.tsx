import Link from "next/link";
import Image from "next/image";

import type { ProtocoloCard } from "@/lib/catalogo";
import type { SeccionEncabezado } from "@/lib/content";
import { urlPublica } from "@/lib/storage";
import { rangoInversion } from "@/lib/format";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function ProtocolosPreview({
  protocolos,
  encabezado,
}: {
  protocolos: ProtocoloCard[];
  encabezado: SeccionEncabezado | null;
}) {
  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {encabezado?.kicker ?? "Protocolos"}
          </p>
        </Reveal>
        {encabezado?.titulo && (
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-fluid-2xl">{encabezado.titulo}</h2>
          </Reveal>
        )}
        <Reveal delay={0.16}>
          <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
        </Reveal>
      </div>

      {protocolos.length === 0 ? (
        <Reveal delay={0.2}>
          <div className="mx-auto mt-10 max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Los protocolos se publican desde el portal y aparecerán aquí en
              cuanto estén listos.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {protocolos.map((p, i) => {
            const img = urlPublica(p.imagen_path);
            const precio = rangoInversion(p.inversion_min, p.inversion_max);
            return (
              <Reveal key={p.id} delay={0.1 + i * 0.08}>
                <Link
                  href="/protocolos"
                  className="group block overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-16px_rgba(28,26,25,0.25)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-bl-marble">
                    {img ? (
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="bl-rule w-8 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-fluid-lg">{p.nombre}</h3>
                    {(p.descripcion || p.para_quien) && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {p.descripcion ?? p.para_quien}
                      </p>
                    )}
                    {precio && (
                      <p className="mt-4 text-sm font-medium text-bl-charcoal">
                        {precio}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      <Reveal delay={0.2}>
        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/diagnostico">
              {encabezado?.cta_texto ?? "Descubre tu protocolo"}
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
