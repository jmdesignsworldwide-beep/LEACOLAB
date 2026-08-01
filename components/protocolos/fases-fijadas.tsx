"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";

import type { Fase } from "@/lib/catalogo";

export function FasesFijadas({ fases }: { fases: Fase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [activa, setActiva] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(fases.length - 1, Math.floor(p * fases.length + 0.0001));
    setActiva(Math.max(0, idx));
  });

  const ancho = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (fases.length === 0) return null;

  return (
    <>
      {/* Desktop: sección fijada */}
      <div
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${fases.length * 100}svh` }}
      >
        <div className="sticky top-0 flex h-svh items-center">
          <div className="container grid grid-cols-2 gap-12">
            {/* Izquierda fija: número + nombre + progreso */}
            <div>
              <p className="font-display text-[7rem] leading-none text-bl-charcoal/90">
                {String(fases[activa].numero).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-fluid-2xl">{fases[activa].nombre}</h3>
              {fases[activa].duracion_texto && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {fases[activa].duracion_texto}
                </p>
              )}
              <div className="mt-8 h-0.5 w-full overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-bl-gold"
                  style={{ width: ancho }}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Fase {activa + 1} de {fases.length}
              </p>
            </div>

            {/* Derecha: contenido con cross-fade */}
            <div className="relative min-h-64">
              {fases.map((f, i) => (
                <div
                  key={f.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === activa ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {f.descripcion && (
                    <p className="max-w-md text-fluid-base leading-relaxed text-muted-foreground">
                      {f.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Móvil: línea de tiempo apilada */}
      <ol className="container relative md:hidden">
        <span className="absolute bottom-2 left-[15px] top-2 w-px bg-border" aria-hidden />
        {fases.map((f) => (
          <li key={f.id} className="relative flex gap-5 pb-10 last:pb-0">
            <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-bl-gold bg-background font-display text-sm text-bl-charcoal">
              {f.numero}
            </span>
            <div className="pt-1">
              <h3 className="text-fluid-lg">{f.nombre}</h3>
              {f.duracion_texto && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {f.duracion_texto}
                </p>
              )}
              {f.descripcion && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.descripcion}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
