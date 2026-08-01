"use client";

import { useEffect } from "react";

import { whatsappUrl } from "@/lib/site";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-svh bg-background text-foreground antialiased">
        <main className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Beauty by Leela
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-3xl">
            Algo falló de nuestro lado
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Ya lo estamos revisando. Intenta de nuevo en un momento, o
            escríbenos directo por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-md bg-bl-charcoal px-6 text-sm font-medium text-bl-cream"
            >
              Reintentar
            </button>
            <a
              href={whatsappUrl("Hola, la web de Beauty by Leela no cargó.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium"
            >
              Escribir por WhatsApp
            </a>
          </div>
          {error.digest && (
            <p className="mt-8 text-xs text-muted-foreground/70">
              Código de referencia: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
