"use client";

import { useEffect } from "react";
import Link from "next/link";

import { siteConfig, whatsappUrl } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function SitioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // El detalle real ya queda en los logs del servidor; aquí solo registramos
    // en consola del cliente para diagnóstico, sin mostrarlo en pantalla.
    console.error(error);
  }, [error]);

  return (
    <section className="container flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Algo falló
      </p>
      <h1 className="mt-4 max-w-xl text-fluid-2xl">
        Algo falló de nuestro lado
      </h1>
      <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        Ya lo estamos revisando. Puedes reintentar en un momento, o escribirnos
        directo por WhatsApp y te atendemos.
      </p>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          Reintentar
        </Button>
        <Button asChild size="lg" variant="outline">
          <a
            href={whatsappUrl("Hola, tuve un problema en la web de Beauty by Leela.")}
            target="_blank"
            rel="noreferrer"
          >
            Escribir por WhatsApp
          </a>
        </Button>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Volver al inicio
      </Link>

      {error.digest && (
        <p className="mt-8 text-xs text-muted-foreground/70">
          Código de referencia: {error.digest}
        </p>
      )}
    </section>
  );
}
