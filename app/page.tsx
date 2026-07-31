import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      {/* Intro de fundación — el hero cinematográfico real llega en la Tanda 3 */}
      <section className="bl-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-28 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            8 años · 22K+ · Santo Domingo
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mx-auto mt-6 max-w-4xl text-fluid-hero font-semibold leading-[1.05]">
            Restauramos tu piel.
            <br />
            Y tu autoestima.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="bl-rule mx-auto mt-8 w-12 opacity-70" />
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-fluid-lg leading-relaxed text-muted-foreground">
            No vendemos citas: acompañamos procesos reales de la mano de
            especialistas expertas. Un santuario para tu piel en el corazón de
            Santo Domingo.
          </p>
        </Reveal>

        {/* Bifurcación (Prompt Maestro §1.4) */}
        <Reveal delay={0.32}>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/diagnostico">Quiero sanar mi piel</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/formacion">Quiero convertirme en experta</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <p className="mt-14 font-display text-fluid-lg tracking-wide text-bl-charcoal/80">
            {siteConfig.tagline}
          </p>
        </Reveal>
      </section>

      {/* Nota de fundación (temporal — se retira al avanzar las tandas) */}
      <section className="border-t border-border bg-bl-marble/60">
        <div className="container py-16 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Tanda 1 · Fundación
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto mt-4 max-w-2xl text-fluid-2xl">
              Sistema de diseño y estructura listos
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-lg text-fluid-base leading-relaxed text-muted-foreground">
              Tokens de marca, tipografía Fraunces &amp; Geist, navegación y pie
              de página en su lugar. El contenido de cada sección se construye en
              las próximas tandas.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
