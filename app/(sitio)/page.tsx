import {
  getContenido,
  type HeroContenido,
  type SantuarioContenido,
} from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { Santuario } from "@/components/home/santuario";

// ISR: el contenido se edita en Supabase; se revalida periódicamente.
export const revalidate = 300;

export default async function HomePage() {
  const [hero, santuario] = await Promise.all([
    getContenido<HeroContenido>("home_hero"),
    getContenido<SantuarioContenido>("home_santuario"),
  ]);

  return (
    <>
      <Hero contenido={hero} />
      <Santuario contenido={santuario} />
    </>
  );
}
