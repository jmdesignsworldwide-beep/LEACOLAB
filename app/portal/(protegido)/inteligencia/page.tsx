import { requirePortalUser } from "@/lib/portal";
import { getInteligencia } from "@/lib/intel";
import { PanelInteligencia } from "@/components/portal/panel-inteligencia";

export const dynamic = "force-dynamic";

export default async function InteligenciaPage() {
  const usuario = await requirePortalUser();

  // La analítica es SOLO para admin (la editora no la ve).
  if (usuario.rol !== "admin") {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">
          La sección de inteligencia está disponible solo para la administradora.
        </p>
      </div>
    );
  }

  const data = await getInteligencia(7);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Inteligencia del visitante
        </p>
        <h1 className="mt-2 font-display text-fluid-2xl">Cómo se comporta la gente</h1>
      </header>

      {!data.hayDatos ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Todavía no hay datos agregados. En cuanto el sitio en producción reciba
            visitas, el resumen diario aparecerá aquí (se consolida cada noche).
          </p>
        </div>
      ) : (
        <PanelInteligencia data={data} />
      )}
    </div>
  );
}
