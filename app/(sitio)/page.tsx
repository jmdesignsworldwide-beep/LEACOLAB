import { Suspense } from "react";
import Link from "next/link";

import {
  getContenido,
  type HeroContenido,
  type SantuarioContenido,
  type SeccionEncabezado,
} from "@/lib/content";
import { getCasoDestacadoGaleria } from "@/lib/casos";
import { siteConfig } from "@/lib/site";
import { Hero } from "@/components/home/hero";
import { Santuario } from "@/components/home/santuario";
import { TransformacionesPreview } from "@/components/home/transformaciones-preview";
import { SectionBoundary } from "@/components/section-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ISR: el contenido se edita en Supabase; se revalida periódicamente.
export const revalidate = 300;

export default async function HomePage() {
  const [hero, santuario, encGaleria] = await Promise.all([
    getContenido<HeroContenido>("home_hero"),
    getContenido<SantuarioContenido>("home_santuario"),
    getContenido<SeccionEncabezado>("home_transformaciones"),
  ]);

  return (
    <>
      {/* Above-the-fold: directo (LCP seguro). */}
      <Hero contenido={hero} />
      <Santuario contenido={santuario} />

      {/* Servicios (teaser informativo) */}
      <section className="container py-20 text-center md:py-28">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Servicios
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-fluid-2xl">
          Tratamientos faciales, corporales y avanzados
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Cada servicio con su duración y precio, para que sepas exactamente qué
          esperar antes de reservar.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
              Reservar cita
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/servicios">Ver servicios y precios</Link>
          </Button>
        </div>
      </section>

      {/* Galería (teaser) — carga aislada */}
      <SectionBoundary titulo="No pudimos cargar la galería">
        <Suspense fallback={<PreviewSkeleton conImagen />}>
          <GaleriaSlot encabezado={encGaleria} />
        </Suspense>
      </SectionBoundary>
    </>
  );
}

async function GaleriaSlot({
  encabezado,
}: {
  encabezado: SeccionEncabezado | null;
}) {
  const caso = await getCasoDestacadoGaleria();
  return <TransformacionesPreview caso={caso} encabezado={encabezado} />;
}

function PreviewSkeleton({ conImagen = false }: { conImagen?: boolean }) {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {conImagen && <Skeleton className="aspect-[4/5] w-full" />}
        <div className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-px w-12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </section>
  );
}
