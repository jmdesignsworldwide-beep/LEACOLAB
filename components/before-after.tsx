"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function BeforeAfter({
  antes,
  despues,
  etiquetaAntes = "Antes",
  etiquetaDespues = "Después",
}: {
  antes: string;
  despues: string;
  etiquetaAntes?: string;
  etiquetaDespues?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);
  const [frac, setFrac] = useState(0.5); // 0..1 posición del divisor
  const x = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const w = el.clientWidth;
      setAncho(w);
      x.set(w * frac);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);

  useMotionValueEvent(x, "change", (v) => {
    if (ancho > 0) setFrac(clamp(v / ancho, 0, 1));
  });

  function onKey(e: React.KeyboardEvent) {
    if (!ancho) return;
    const paso = ancho * 0.05;
    if (e.key === "ArrowLeft") {
      x.set(clamp(x.get() - paso, 0, ancho));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      x.set(clamp(x.get() + paso, 0, ancho));
      e.preventDefault();
    }
  }

  const pct = Math.round(frac * 100);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-lg bg-bl-marble"
    >
      {/* Antes (debajo, completo) */}
      <Image
        src={antes}
        alt={etiquetaAntes}
        fill
        sizes="(min-width: 768px) 45vw, 90vw"
        className="pointer-events-none object-cover"
      />
      {/* Después (encima, recortado hasta el divisor) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <Image
          src={despues}
          alt={etiquetaDespues}
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="pointer-events-none object-cover"
        />
      </div>

      {/* Etiquetas */}
      <span className="absolute left-3 top-3 rounded-full bg-bl-charcoal/70 px-2.5 py-1 text-[11px] uppercase tracking-wide text-bl-cream">
        {etiquetaAntes}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-bl-charcoal/70 px-2.5 py-1 text-[11px] uppercase tracking-wide text-bl-cream">
        {etiquetaDespues}
      </span>

      {/* Divisor arrastrable */}
      <motion.div
        drag="x"
        dragConstraints={ref}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onKeyDown={onKey}
        role="slider"
        tabIndex={0}
        aria-label="Comparar antes y después"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="absolute inset-y-0 left-0 z-10 flex w-0 cursor-ew-resize items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="absolute inset-y-0 w-0.5 bg-bl-cream/90" />
        <span className="grid size-10 place-items-center rounded-full bg-bl-cream text-bl-charcoal shadow-md ring-1 ring-bl-charcoal/10">
          <ChevronsLeftRight className="size-5" />
        </span>
      </motion.div>
    </div>
  );
}
