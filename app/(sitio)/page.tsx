import {
  getContenido,
  type HeroContenido,
  type SantuarioContenido,
  type SeccionEncabezado,
} from "@/lib/content";
import { getProtocolosDestacados, getCasoDestacado } from "@/lib/catalogo";
import { Hero } from "@/components/home/hero";
import { Santuario } from "@/components/home/santuario";
import { ProtocolosPreview } from "@/components/home/protocolos-preview";
import { TransformacionesPreview } from "@/components/home/transformaciones-preview";

// ISR: el contenido se edita en Supabase; se revalida periódicamente.
export const revalidate = 300;

export default async function HomePage() {
  const [hero, santuario, encProtocolos, encTransf, protocolos, caso] =
    await Promise.all([
      getContenido<HeroContenido>("home_hero"),
      getContenido<SantuarioContenido>("home_santuario"),
      getContenido<SeccionEncabezado>("home_protocolos"),
      getContenido<SeccionEncabezado>("home_transformaciones"),
      getProtocolosDestacados(3),
      getCasoDestacado(),
    ]);

  return (
    <>
      <Hero contenido={hero} />
      <Santuario contenido={santuario} />
      <ProtocolosPreview protocolos={protocolos} encabezado={encProtocolos} />
      <TransformacionesPreview caso={caso} encabezado={encTransf} />
    </>
  );
}
