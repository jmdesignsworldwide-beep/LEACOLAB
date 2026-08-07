import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  getContenido,
  type NosotrasContenido,
  type MedicoContenido,
  type SantuarioContenido,
} from "@/lib/content";
import { getEspecialistas } from "@/lib/catalogo";
import { urlPublica } from "@/lib/storage";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Santuario } from "@/components/home/santuario";

export const revalidate = 300;
export const metadata: Metadata = { title: "Nosotras" };

function parrafos(h?: string[] | string): string[] {
  if (!h) return [];
  return Array.isArray(h) ? h : [h];
}

export default async function NosotrasPage() {
  const [nosotras, medico, espacio, especialistas] = await Promise.all([
    getContenido<NosotrasContenido>("nosotras"),
    getContenido<MedicoContenido>("medico"),
    getContenido<SantuarioContenido>("nosotras_espacio"),
    getEspecialistas(),
  ]);

  const foto = urlPublica(nosotras?.foto_path);
  const historia = parrafos(nosotras?.historia);
  const fotoMedico = urlPublica(medico?.foto_path);

  return (
    <div className="pb-24">
      {/* 1. Marianny */}
      <section className="container grid items-center gap-10 pt-28 md:grid-cols-2 md:pt-32">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-bl-marble">
          {foto ? (
            <Image
              src={foto}
              alt={nosotras?.titulo ?? "Marianny Belén"}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="bl-rule w-10 opacity-60" />
              <p className="mt-4 px-6 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Retrato en preparación
              </p>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {nosotras?.kicker ?? "Nosotras"}
          </p>
          <h1 className="mt-3 text-fluid-3xl">
            {nosotras?.titulo ?? "Marianny Belén"}
          </h1>
          <div className="bl-rule mt-6 w-12 opacity-70" />
          {historia.length > 0 ? (
            <div className="mt-6 space-y-4">
              {historia.map((p, i) => (
                <p
                  key={i}
                  className="max-w-md text-fluid-base leading-relaxed text-muted-foreground"
                >
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              La historia de Marianny se carga desde el portal.
            </p>
          )}
        </div>
      </section>

      {/* 2. Especialistas */}
      <section className="container mt-24">
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              El equipo
            </p>
            <h2 className="mt-4 text-fluid-2xl">Nuestras especialistas</h2>
            <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
          </div>
        </Reveal>

        {especialistas.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              El equipo se publica desde el portal y aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {especialistas.map((e, i) => {
              const f = urlPublica(e.foto_path);
              return (
                <Reveal key={e.id} delay={0.06 * i}>
                  <div className="group text-center">
                    <div className="relative mx-auto aspect-[3/4] overflow-hidden rounded-lg bg-bl-marble">
                      {f ? (
                        <Image
                          src={f}
                          alt={e.nombre}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="bl-rule w-8 opacity-50" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-fluid-lg">{e.nombre}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[e.especialidad, e.anios ? `${e.anios} años` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Dra. Saida Medrano (área médica) */}
      <section className="container mt-24">
        <div className="mx-auto max-w-4xl rounded-lg border border-bl-gold/40 bg-bl-marble/50 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Área médica
          </p>
          {medico?.activo ? (
            <div className="mt-6 grid items-center gap-8 md:grid-cols-[200px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-full bg-bl-marble">
                {fotoMedico && (
                  <Image
                    src={fotoMedico}
                    alt={medico.nombre ?? ""}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="text-fluid-2xl">{medico.nombre}</h2>
                {medico.credenciales && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {medico.credenciales}
                  </p>
                )}
                {medico.bio && (
                  <p className="mt-4 text-fluid-base leading-relaxed text-muted-foreground">
                    {medico.bio}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              La presentación del área médica se publica desde el portal, con las
              credenciales confirmadas.
            </p>
          )}
        </div>
      </section>

      {/* 4. El santuario */}
      <div className="mt-24">
        <Santuario contenido={espacio} />
      </div>

      {/* 5. Cierre — doble CTA */}
      <section className="container mt-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-xl text-fluid-2xl">
            {siteConfig.tagline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
                Agendar mi evaluación
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/servicios">Ver servicios</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
