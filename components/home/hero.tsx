import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { HeroContenido } from "@/lib/content";
import { urlPublica } from "@/lib/storage";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

function aLineas(titulo?: string[] | string): string[] {
  if (!titulo) return [];
  return Array.isArray(titulo) ? titulo : [titulo];
}

export function Hero({ contenido }: { contenido: HeroContenido | null }) {
  const img = urlPublica(contenido?.imagen_path);
  const lineas = aLineas(contenido?.titulo);
  const hayContenido = lineas.length > 0;
  const sobreImagen = Boolean(img);

  let indicePalabra = 0;

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        {img ? (
          <div className="hero-media absolute inset-0">
            <Image
              src={img}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Scrim para legibilidad del texto centrado (contraste AA) */}
            <div className="absolute inset-0 bg-bl-charcoal/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-bl-charcoal/70 via-transparent to-bl-charcoal/25" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-bl-cream to-bl-marble" />
        )}
        <div className="bl-grain absolute inset-0" />
      </div>

      {hayContenido ? (
        <div className={sobreImagen ? "text-bl-cream" : "text-foreground"}>
          {contenido?.kicker && (
            <p
              className={`hero-fade text-xs uppercase tracking-[0.3em] ${
                sobreImagen ? "text-bl-cream/85" : "text-muted-foreground"
              }`}
              style={{ "--d": "1150ms" } as CSSProperties}
            >
              {contenido.kicker}
            </p>
          )}

          <h1 className="mx-auto mt-6 max-w-[16ch] text-fluid-hero font-semibold leading-[1.08]">
            {lineas.map((linea, li) => (
              <span key={li} className="hero-line">
                {linea.split(" ").map((palabra, wi) => (
                  <span
                    key={wi}
                    className="hero-word"
                    style={{ "--i": indicePalabra++ } as CSSProperties}
                  >
                    {palabra}
                    {" "}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div
            className="hero-fade mx-auto mt-7 h-0.5 w-16 rounded-full bg-bl-gold"
            style={{ "--d": "1000ms" } as CSSProperties}
          />

          {contenido?.subtitulo && (
            <p
              className={`hero-fade mx-auto mt-7 max-w-xl text-fluid-lg leading-relaxed ${
                sobreImagen ? "text-bl-cream/90" : "text-muted-foreground"
              }`}
              style={{ "--d": "1050ms" } as CSSProperties}
            >
              {contenido.subtitulo}
            </p>
          )}

          {(contenido?.cta_primario || contenido?.cta_secundario) && (
            <div
              className="hero-fade mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
              style={{ "--d": "1200ms" } as CSSProperties}
            >
              {contenido?.cta_primario && (
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/diagnostico">{contenido.cta_primario}</Link>
                </Button>
              )}
              {contenido?.cta_secundario && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/formacion">{contenido.cta_secundario}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Estado vacío elegante (sin copy de negocio en el código)
        <div className="flex flex-col items-center text-center">
          <Logo className="h-10" />
          <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Contenido del inicio en preparación
          </p>
        </div>
      )}

      {/* Indicador de scroll */}
      <div
        className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ "--d": "1350ms" } as CSSProperties}
        aria-hidden
      >
        <span
          className={`hero-scroll-dot block size-2 rounded-full ${
            sobreImagen ? "bg-bl-cream" : "bg-bl-gold"
          }`}
        />
      </div>
    </section>
  );
}
