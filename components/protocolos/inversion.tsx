import { Check, Minus } from "lucide-react";

import type { Protocolo } from "@/lib/catalogo";
import type { PrimeraCita } from "@/lib/content";
import { rangoInversion } from "@/lib/format";

/**
 * Bloque "Tu inversión" — el diferenciador del sitio. Precio con orgullo.
 * Etiquetas estructurales en código; montos y listas desde Supabase.
 * Los montos NUNCA en dorado (no pasa contraste): charcoal, prominente.
 */
export function Inversion({
  protocolo,
  primeraCita,
}: {
  protocolo: Protocolo;
  primeraCita: PrimeraCita | null;
}) {
  const desde = rangoInversion(protocolo.inversion_min, protocolo.inversion_max);

  return (
    <div className="rounded-lg border border-border bg-background p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Tu inversión
      </p>
      <div className="bl-rule mt-4 w-10 opacity-70" />

      <dl className="mt-6 space-y-5">
        {primeraCita?.monto_texto && (
          <div>
            <dt className="text-sm text-muted-foreground">Evaluación inicial</dt>
            <dd className="mt-1 font-display text-fluid-xl text-bl-charcoal">
              {primeraCita.monto_texto}
              {primeraCita.equivalente && (
                <span className="ml-2 align-middle text-sm text-muted-foreground">
                  ({primeraCita.equivalente})
                </span>
              )}
            </dd>
          </div>
        )}

        {desde && (
          <div>
            <dt className="text-sm text-muted-foreground">
              Sesiones de seguimiento
            </dt>
            <dd className="mt-1 font-display text-fluid-lg text-bl-charcoal">
              {desde}
            </dd>
          </div>
        )}

        {protocolo.duracion_texto && (
          <div>
            <dt className="text-sm text-muted-foreground">Duración estimada</dt>
            <dd className="mt-1 text-fluid-base text-foreground">
              {protocolo.duracion_texto}
            </dd>
          </div>
        )}
      </dl>

      {(protocolo.incluye.length > 0 || protocolo.no_incluye.length > 0) && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {protocolo.incluye.length > 0 && (
            <div>
              <p className="text-sm font-medium">Qué incluye</p>
              <ul className="mt-3 space-y-2">
                {protocolo.incluye.map((x, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-bl-gold-deep" aria-hidden />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {protocolo.no_incluye.length > 0 && (
            <div>
              <p className="text-sm font-medium">Qué no incluye</p>
              <ul className="mt-3 space-y-2">
                {protocolo.no_incluye.map((x, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {primeraCita?.nota && (
        <p className="mt-6 text-sm italic text-muted-foreground">
          {primeraCita.nota}
        </p>
      )}
    </div>
  );
}
