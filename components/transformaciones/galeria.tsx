"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import type { CasoGaleria } from "@/lib/casos";
import { BLUR_MARBLE } from "@/lib/blur";
import { BeforeAfter } from "@/components/before-after";
import { ViewTransitionLink } from "@/components/view-transition-link";

const TODAS = "Todas";

function meta(caso: CasoGaleria): string {
  return [
    caso.condicion,
    caso.semana_tratamiento ? `Semana ${caso.semana_tratamiento}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function GaleriaTransformaciones({
  casos,
  condiciones,
}: {
  casos: CasoGaleria[];
  condiciones: string[];
}) {
  const [filtro, setFiltro] = useState<string>(TODAS);
  const [abierto, setAbierto] = useState<CasoGaleria | null>(null);

  const visibles =
    filtro === TODAS ? casos : casos.filter((c) => c.condicion === filtro);

  const chips = [TODAS, ...condiciones];

  return (
    <>
      {/* Filtro por condición */}
      {condiciones.length > 1 && (
        <div
          role="group"
          aria-label="Filtrar por condición"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {chips.map((c) => {
            const activo = c === filtro;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={activo}
                onClick={() => setFiltro(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activo
                    ? "border-bl-charcoal bg-bl-charcoal text-bl-cream"
                    : "border-border bg-background text-foreground/80 hover:bg-muted"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}

      {/* Rejilla */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((caso) => (
          <figure key={caso.id} className="group">
            <BeforeAfter
              antes={caso.antes!}
              despues={caso.despues!}
              blurDataURL={BLUR_MARBLE}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            />
            <figcaption className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{meta(caso)}</span>
              <button
                type="button"
                onClick={() => setAbierto(caso)}
                className="shrink-0 text-sm font-medium text-bl-charcoal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ver ficha
              </button>
            </figcaption>
          </figure>
        ))}
      </div>

      {abierto && (
        <FichaModal caso={abierto} onClose={() => setAbierto(null)} />
      )}
    </>
  );
}

function FichaModal({
  caso,
  onClose,
}: {
  caso: CasoGaleria;
  onClose: () => void;
}) {
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cerrarRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ficha-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-bl-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background p-6 shadow-xl md:p-8">
        <button
          ref={cerrarRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-border bg-background text-foreground/70 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <BeforeAfter
            antes={caso.antes!}
            despues={caso.despues!}
            blurDataURL={BLUR_MARBLE}
            sizes="(min-width: 768px) 45vw, 90vw"
          />
          <div className="pr-6 md:pr-0">
            <h2 id="ficha-titulo" className="text-fluid-xl">
              {caso.condicion}
            </h2>
            {caso.semana_tratamiento && (
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Semana {caso.semana_tratamiento} de tratamiento
              </p>
            )}
            <div className="bl-rule mt-4 w-10 opacity-70" />

            {caso.notas && (
              <p className="mt-5 text-fluid-base leading-relaxed text-muted-foreground">
                {caso.notas}
              </p>
            )}

            {caso.protocolo_slug && caso.protocolo_nombre && (
              <p className="mt-6 text-sm">
                <ViewTransitionLink
                  href={`/protocolos/${caso.protocolo_slug}`}
                  className="font-medium text-bl-charcoal underline-offset-4 hover:underline"
                >
                  Ver el protocolo: {caso.protocolo_nombre}
                </ViewTransitionLink>
              </p>
            )}

            <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
              Imagen publicada con el consentimiento firmado de la paciente. Los
              resultados varían según cada piel y cada proceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
