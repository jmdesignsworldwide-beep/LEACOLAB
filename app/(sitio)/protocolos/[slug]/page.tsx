import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import {
  getProtocoloPorSlug,
  getCasosPorProtocolo,
} from "@/lib/catalogo";
import { getContenido, type PrimeraCita, type AgendarAviso } from "@/lib/content";
import { urlPublica } from "@/lib/storage";
import { Reveal } from "@/components/reveal";
import { FasesFijadas } from "@/components/protocolos/fases-fijadas";
import { Inversion } from "@/components/protocolos/inversion";
import { AgendarAvisoBloque } from "@/components/agendar-aviso";
import { BeforeAfter } from "@/components/before-after";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProtocoloPorSlug(slug);
  return { title: p?.nombre ?? "Protocolo" };
}

export default async function ProtocoloDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [protocolo, primeraCita, aviso] = await Promise.all([
    getProtocoloPorSlug(slug),
    getContenido<PrimeraCita>("primera_cita"),
    getContenido<AgendarAviso>("agendar_aviso"),
  ]);
  if (!protocolo) notFound();

  const casos = await getCasosPorProtocolo(protocolo.id);
  const img = urlPublica(protocolo.imagen_path);
  const vtName = `proto-img-${protocolo.slug}`;

  return (
    <div className="pb-24">
      {/* Encabezado */}
      <section className="container grid items-center gap-10 pt-28 md:grid-cols-2 md:pt-32">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Protocolo
          </p>
          <h1 className="mt-3 text-fluid-3xl">{protocolo.nombre}</h1>
          <div className="bl-rule mt-6 w-12 opacity-70" />
          {protocolo.para_quien && (
            <p className="mt-6 max-w-md text-fluid-base leading-relaxed text-muted-foreground">
              {protocolo.para_quien}
            </p>
          )}
          {protocolo.descripcion && (
            <p className="mt-4 max-w-md text-fluid-base leading-relaxed text-muted-foreground">
              {protocolo.descripcion}
            </p>
          )}
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-bl-marble">
          {img && (
            <Image
              src={img}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
              style={{ viewTransitionName: vtName } as CSSProperties}
            />
          )}
        </div>
      </section>

      {/* Fases (sección fijada) */}
      {protocolo.fases.length > 0 && (
        <section className="mt-12 md:mt-16">
          <div className="container">
            <h2 className="text-fluid-xl">El recorrido</h2>
            <div className="bl-rule mt-4 w-10 opacity-70" />
          </div>
          <div className="mt-8 md:mt-4">
            <FasesFijadas fases={protocolo.fases} />
          </div>
        </section>
      )}

      {/* Tu inversión */}
      <section className="container mt-16">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Inversion protocolo={protocolo} primeraCita={primeraCita} />
          </Reveal>
        </div>
      </section>

      {/* Transformaciones de este protocolo */}
      {casos.length > 0 && (
        <section className="container mt-20">
          <Reveal>
            <h2 className="text-center text-fluid-2xl">Transformaciones</h2>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-3xl gap-8 sm:grid-cols-2">
            {casos.slice(0, 2).map((c) => {
              const antes = urlPublica(c.imagen_antes_path);
              const despues = urlPublica(c.imagen_despues_path);
              if (!antes || !despues) return null;
              return (
                <Reveal key={c.id}>
                  <BeforeAfter antes={antes} despues={despues} />
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    {[
                      c.condicion,
                      c.semana_tratamiento ? `Semana ${c.semana_tratamiento}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Agendar */}
      <section className="container mt-20">
        <div className="mx-auto max-w-2xl">
          <AgendarAvisoBloque aviso={aviso} />
        </div>
      </section>
    </div>
  );
}
