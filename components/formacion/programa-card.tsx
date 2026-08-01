import Image from "next/image";
import { Check } from "lucide-react";

import { type Programa, TIPO_LABEL, MODALIDAD_LABEL } from "@/lib/formacion";
import { urlPublica } from "@/lib/storage";
import { formatoRD } from "@/lib/format";

export function ProgramaCard({
  programa,
  prioridad = false,
}: {
  programa: Programa;
  prioridad?: boolean;
}) {
  const img = urlPublica(programa.imagen_path);
  const inversion = formatoRD(programa.inversion);
  const sub = [
    programa.modalidad ? MODALIDAD_LABEL[programa.modalidad] : null,
    programa.duracion_texto,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      {img && (
        <div className="relative aspect-[16/10] bg-bl-marble">
          <Image
            src={img}
            alt=""
            fill
            priority={prioridad}
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {TIPO_LABEL[programa.tipo]}
        </p>
        <h3 className="mt-2 text-fluid-lg">{programa.nombre}</h3>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}

        {programa.para_quien && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {programa.para_quien}
          </p>
        )}

        {programa.temario.length > 0 && (
          <ul className="mt-5 space-y-2">
            {programa.temario.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-foreground/85">
                <Check className="mt-0.5 size-4 shrink-0 text-bl-gold-deep" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          {inversion && (
            <p className="text-sm font-medium text-bl-charcoal">{inversion}</p>
          )}
          {programa.cupo != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              Cupos limitados: {programa.cupo}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
