import type { Metadata } from "next";
import Link from "next/link";

import { getProtocolos } from "@/lib/catalogo";
import {
  getContenido,
  type SeccionEncabezado,
  type AgendarAviso,
} from "@/lib/content";
import { rangoInversion } from "@/lib/format";
import { Reveal } from "@/components/reveal";
import { ProtocoloCard } from "@/components/protocolos/protocolo-card";
import { AgendarAvisoBloque } from "@/components/agendar-aviso";

export const revalidate = 300;
export const metadata: Metadata = { title: "Protocolos" };

export default async function ProtocolosPage() {
  const [intro, aviso, protocolos] = await Promise.all([
    getContenido<SeccionEncabezado>("protocolos_intro"),
    getContenido<AgendarAviso>("agendar_aviso"),
    getProtocolos(),
  ]);

  const principales = protocolos.filter((p) => p.fases.length > 0);
  const complementarios = protocolos.filter((p) => p.fases.length === 0);

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {intro?.kicker ?? "Protocolos"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {intro?.titulo ?? "Procesos con inversión transparente"}
        </h1>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
      </section>

      {protocolos.length === 0 ? (
        <section className="container mt-12">
          <div className="mx-auto max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Los protocolos se publican desde el portal y aparecerán aquí en
              cuanto estén listos.
            </p>
          </div>
        </section>
      ) : (
        <>
          {principales.length > 0 && (
            <section className="container mt-14">
              <div className="grid gap-6 md:grid-cols-2">
                {principales.map((p, i) =>
                  // Las primeras tarjetas están en el primer pliegue: se
                  // renderizan visibles (sin Reveal) para no bloquear el LCP.
                  i < 2 ? (
                    <ProtocoloCard key={p.id} protocolo={p} prioridad />
                  ) : (
                    <Reveal key={p.id} delay={0.08 + (i - 2) * 0.06}>
                      <ProtocoloCard protocolo={p} />
                    </Reveal>
                  )
                )}
              </div>
            </section>
          )}

          {complementarios.length > 0 && (
            <section className="container mt-20">
              <Reveal>
                <h2 className="text-fluid-xl">Servicios complementarios</h2>
              </Reveal>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {complementarios.map((p, i) => {
                  const desde = rangoInversion(p.inversion_min, p.inversion_max);
                  return (
                    <Reveal key={p.id} delay={0.05 + i * 0.04}>
                      <Link
                        href={`/protocolos/${p.slug}`}
                        className="flex min-h-[52px] items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted"
                      >
                        <span>{p.nombre}</span>
                        {desde && (
                          <span className="shrink-0 text-muted-foreground">
                            {desde}
                          </span>
                        )}
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      <section className="container mt-20">
        <div className="mx-auto max-w-2xl">
          <AgendarAvisoBloque aviso={aviso} />
        </div>
      </section>
    </div>
  );
}
