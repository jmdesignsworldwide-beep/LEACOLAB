import { Check } from "lucide-react";

import type { AgendarAviso } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

/**
 * Explica el proceso de reserva (primera cita, depósito, WhatsApp) ANTES de
 * mandar a Setmore. Con calidez, no como letra chica. Contenido editable.
 */
export function AgendarAvisoBloque({ aviso }: { aviso: AgendarAviso | null }) {
  return (
    <div className="rounded-lg border border-border bg-bl-marble/70 p-6 md:p-8">
      <h2 className="font-display text-fluid-lg">
        {aviso?.titulo ?? "Cómo es tu primera cita"}
      </h2>
      <div className="bl-rule mt-4 w-10 opacity-70" />

      {aviso?.puntos && aviso.puntos.length > 0 && (
        <ul className="mt-6 space-y-3">
          {aviso.puntos.map((p, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
              <Check className="mt-0.5 size-4 shrink-0 text-bl-gold-deep" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {aviso?.nota && (
        <p className="mt-5 text-sm italic text-muted-foreground">{aviso.nota}</p>
      )}

      <div className="mt-7">
        <Button asChild size="lg">
          <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
            {aviso?.cta_texto ?? "Agendar mi evaluación"}
          </a>
        </Button>
      </div>
    </div>
  );
}
