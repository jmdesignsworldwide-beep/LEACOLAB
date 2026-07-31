import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      {/* Intro de fundación — el hero cinematográfico real llega en la Tanda 3.
          El contenido se renderiza VISIBLE de inmediato (sin gate de opacidad por
          JS) para no penalizar el LCP; el movimiento se reserva para el scroll. */}
      <section className="bl-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
        {/* Strip de credenciales con separadores dorados */}
        <p className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
          <span>8 años</span>
          <span aria-hidden className="inline-block size-1 rounded-full bg-bl-gold" />
          <span>22K+</span>
          <span aria-hidden className="inline-block size-1 rounded-full bg-bl-gold" />
          <span>Santo Domingo</span>
        </p>

        <h1 className="mx-auto mt-6 max-w-[18ch] text-fluid-hero font-semibold leading-[1.05]">
          <span className="block text-balance">Restauramos tu piel.</span>
          <span className="block text-balance">Y tu autoestima.</span>
        </h1>

        {/* Divisoria dorada — visible, no un hilo apagado */}
        <div className="mx-auto mt-7 h-0.5 w-16 rounded-full bg-bl-gold" />

        <p className="mx-auto mt-7 max-w-xl text-fluid-lg leading-relaxed text-muted-foreground">
          No vendemos citas: acompañamos procesos reales de la mano de
          especialistas expertas. Un santuario para tu piel en el corazón de
          Santo Domingo.
        </p>

        {/* Bifurcación (Prompt Maestro §1.4) */}
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
      </section>

      {/* Momento oscuro de impacto — el lema (versión simple para la Tanda 1).
          Debajo del pliegue: aquí sí se revela con el scroll. */}
      <section className="bl-grain relative overflow-hidden bg-bl-charcoal py-24 text-center md:py-32">
        <div className="container">
          <Reveal>
            <div className="mx-auto h-0.5 w-12 rounded-full bg-bl-gold" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-3xl font-display text-fluid-2xl leading-tight tracking-wide text-bl-cream">
              CAMBIAMOS VIDAS Y AUTOESTIMAS
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-bl-gold">
              {siteConfig.fullName}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
