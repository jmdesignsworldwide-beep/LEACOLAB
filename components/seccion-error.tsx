"use client";

import { whatsappUrl } from "@/lib/site";

/**
 * Estado de error de UNA sección (no tumba el resto de la página). Mensaje
 * humano, sin detalle técnico, con reintento y salida por WhatsApp.
 */
export function SeccionError({ titulo }: { titulo?: string }) {
  return (
    <div className="container">
      <div className="mx-auto max-w-md rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-foreground/80">
          {titulo ?? "No pudimos cargar esta sección"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Puedes reintentar en un momento.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-bl-charcoal px-5 text-sm font-medium text-bl-cream"
          >
            Reintentar
          </button>
          <a
            href={whatsappUrl("Hola, tuve un problema en la web de Beauty by Leela.")}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
