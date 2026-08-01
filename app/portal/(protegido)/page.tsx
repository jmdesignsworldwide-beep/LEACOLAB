import { requirePortalUser } from "@/lib/portal";

export const dynamic = "force-dynamic";

const metricas = [
  "Consultas del mes",
  "Urgencia alta",
  "Ya intentó tratamiento",
  "Buscan formación",
];

export default async function PortalDashboard() {
  const usuario = await requirePortalUser();
  const primerNombre = usuario.nombre.split(" ")[0];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Panel
      </p>
      <h1 className="mt-2 text-fluid-2xl">Hola, {primerNombre}</h1>
      <p className="mt-2 max-w-xl text-fluid-base text-muted-foreground">
        Aquí vivirá la inteligencia de mercado de Beauty by Leela: qué buscan
        tus consultas, su urgencia y de dónde vienen.
      </p>

      {/* Estado vacío intencional (aún no hay datos del Diagnóstico) */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map((m) => (
          <div
            key={m}
            className="rounded-lg border border-dashed border-border bg-background p-5"
          >
            <p className="text-sm text-muted-foreground">{m}</p>
            <p className="mt-3 font-display text-3xl text-muted-foreground/50">—</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-background p-8 text-center">
        <div className="mx-auto h-0.5 w-10 rounded-full bg-bl-gold" />
        <h2 className="mt-5 text-fluid-lg">Aún no hay datos suficientes</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Cuando el Diagnóstico de Piel reciba tus primeras consultas, este panel
          empezará a mostrarte la distribución de condiciones, la urgencia y tu
          bandeja de leads. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
