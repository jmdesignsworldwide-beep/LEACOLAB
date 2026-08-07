import type { Metadata } from "next";

import { getCasosGaleria, condicionesDe } from "@/lib/casos";
import { getContenido, type SeccionEncabezado } from "@/lib/content";
import { GaleriaTransformaciones } from "@/components/transformaciones/galeria";

export const revalidate = 300;
export const metadata: Metadata = { title: "Galería" };

export default async function GaleriaPage() {
  const [intro, casos] = await Promise.all([
    getContenido<SeccionEncabezado>("galeria_intro"),
    getCasosGaleria(),
  ]);

  const condiciones = condicionesDe(casos);

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {intro?.kicker ?? "Galería"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {intro?.titulo ?? "Resultados reales"}
        </h1>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Cada imagen se publica con el consentimiento firmado de la paciente.
          Los resultados varían según cada piel y cada proceso.
        </p>
      </section>

      <section className="container">
        {casos.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              La galería se publica desde el portal, con su consentimiento, y
              aparecerá aquí en cuanto esté lista.
            </p>
          </div>
        ) : (
          <GaleriaTransformaciones casos={casos} condiciones={condiciones} />
        )}
      </section>
    </div>
  );
}
