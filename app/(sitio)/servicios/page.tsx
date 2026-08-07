import type { Metadata } from "next";

import { getServicios, precioServicio } from "@/lib/servicios";
import { getContenido, type SeccionEncabezado } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const revalidate = 300;
export const metadata: Metadata = { title: "Servicios" };

export default async function ServiciosPage() {
  const [intro, grupos] = await Promise.all([
    getContenido<SeccionEncabezado>("servicios_intro"),
    getServicios(),
  ]);

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {intro?.kicker ?? "Servicios"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {intro?.titulo ?? "Nuestros servicios"}
        </h1>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
        <div className="mt-8">
          <Button asChild size="lg">
            <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
              Reservar cita
            </a>
          </Button>
        </div>
      </section>

      {grupos.length === 0 ? (
        <section className="container mt-12">
          <div className="mx-auto max-w-md rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Los servicios se publican desde el portal y aparecerán aquí con su
              precio y duración.
            </p>
          </div>
        </section>
      ) : (
        <div className="container mt-16 space-y-14">
          {grupos.map((g) => (
            <section key={g.categoria}>
              <h2 className="text-fluid-xl">{g.categoria}</h2>
              <div className="bl-rule mt-3 w-10 opacity-70" />
              <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-background">
                {g.servicios.map((s) => {
                  const precio = precioServicio(s);
                  return (
                    <li
                      key={s.id}
                      className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{s.nombre}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {[s.duracion_texto, s.detalle].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        {precio && (
                          <span className="text-sm font-medium text-bl-charcoal">
                            {precio}
                          </span>
                        )}
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={siteConfig.setmoreUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Reservar
                          </a>
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
