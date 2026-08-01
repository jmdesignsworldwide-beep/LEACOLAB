import { Suspense } from "react";

import {
  getContenido,
  type HeroContenido,
  type SantuarioContenido,
  type SeccionEncabezado,
} from "@/lib/content";
import { getProtocolosDestacados } from "@/lib/catalogo";
import { getCasoDestacadoGaleria } from "@/lib/casos";
import { Hero } from "@/components/home/hero";
import { Santuario } from "@/components/home/santuario";
import { ProtocolosPreview } from "@/components/home/protocolos-preview";
import { TransformacionesPreview } from "@/components/home/transformaciones-preview";
import { SectionBoundary } from "@/components/section-boundary";
import { Skeleton } from "@/components/ui/skeleton";

// ISR: el contenido se edita en Supabase; se revalida periódicamente.
export const revalidate = 300;

export default async function HomePage() {
  // Contenido de marca (tolerante a fallos: cae a textos por defecto).
  const [hero, santuario, encProtocolos, encTransf] = await Promise.all([
    getContenido<HeroContenido>("home_hero"),
    getContenido<SantuarioContenido>("home_santuario"),
    getContenido<SeccionEncabezado>("home_protocolos"),
    getContenido<SeccionEncabezado>("home_transformaciones"),
  ]);

  return (
    <>
      {/* Above-the-fold: se renderiza directo (LCP seguro, sin suspense). */}
      <Hero contenido={hero} />
      <Santuario contenido={santuario} />

      {/* Secciones con datos: cada una carga, y falla, de forma aislada. */}
      <SectionBoundary titulo="No pudimos cargar los protocolos">
        <Suspense fallback={<PreviewSkeleton />}>
          <ProtocolosSlot encabezado={encProtocolos} />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary titulo="No pudimos cargar las transformaciones">
        <Suspense fallback={<PreviewSkeleton conImagen />}>
          <TransformacionesSlot encabezado={encTransf} />
        </Suspense>
      </SectionBoundary>
    </>
  );
}

async function ProtocolosSlot({
  encabezado,
}: {
  encabezado: SeccionEncabezado | null;
}) {
  const protocolos = await getProtocolosDestacados(3);
  return <ProtocolosPreview protocolos={protocolos} encabezado={encabezado} />;
}

async function TransformacionesSlot({
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
