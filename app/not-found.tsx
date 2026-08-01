import Link from "next/link";

import { siteConfig, whatsappUrl } from "@/lib/site";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-24 text-center">
      <Logo className="h-8 opacity-90" />

      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Página no encontrada
      </p>
      <h1 className="mt-4 max-w-xl text-fluid-3xl">
        Esta página no existe o se movió de lugar
      </h1>
      <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        Puede que el enlace sea viejo o esté mal escrito. Te dejamos por dónde
        seguir.
      </p>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/protocolos">Ver protocolos</Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <a
          href={siteConfig.setmoreUrl}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Agendar evaluación
        </a>
        <a
          href={whatsappUrl("Hola, escribo desde la web de Beauty by Leela.")}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Escribir por WhatsApp
        </a>
      </div>
    </main>
  );
}
