"use client";

import { useMemo, useState } from "react";

import {
  type Inteligencia,
  pasoLabel,
  frustracionTexto,
} from "@/lib/intel-tipos";

function tiempo(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}
function delta(actual: number, previo: number): string | null {
  if (!previo) return null;
  const pct = Math.round(((actual - previo) / previo) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

export function PanelInteligencia({ data }: { data: Inteligencia }) {
  const { resumen, geo, frustracion, embudo, recorridos, paths } = data;
  const [path, setPath] = useState(paths[0] ?? "/");
  const [disp, setDisp] = useState<"e" | "m">("e");

  return (
    <div className="space-y-12">
      {/* 4.1 Resumen */}
      <section>
        <h2 className="font-display text-fluid-xl">Resumen</h2>
        <p className="mt-1 text-sm text-muted-foreground">Últimos 7 días.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Cifra
            titulo="Visitantes"
            valor={resumen.sesiones.toLocaleString("es-DO")}
            nota={delta(resumen.sesiones, resumen.sesionesPrevias)}
          />
          <Cifra titulo="Páginas vistas" valor={resumen.vistas.toLocaleString("es-DO")} />
          <Cifra titulo="Tiempo promedio" valor={tiempo(resumen.msProm)} />
          <Cifra
            titulo="Móvil / Escritorio"
            valor={`${resumen.sesiones ? Math.round((resumen.movil / resumen.sesiones) * 100) : 0}% / ${resumen.sesiones ? Math.round((resumen.escritorio / resumen.sesiones) * 100) : 0}%`}
          />
        </div>
        {geo.length > 0 && (
          <div className="mt-5 rounded-lg border border-border bg-background p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">De dónde son</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {geo.map((g, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{[g.ciudad, g.region, g.pais].filter(Boolean).join(", ") || "Desconocido"}</span>
                  <span className="text-muted-foreground">{g.sesiones}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Selector de página/dispositivo (mapas) */}
      <section>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Página</label>
            <select
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="mt-1 block rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {paths.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1 rounded-md border border-border p-1">
            {(["e", "m"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDisp(d)}
                className={`rounded px-3 py-1.5 text-sm ${disp === d ? "bg-bl-charcoal text-bl-cream" : "text-muted-foreground"}`}
              >
                {d === "e" ? "Escritorio" : "Móvil"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <MapaCalor data={data} path={path} disp={disp} />
          <MapaScroll data={data} path={path} disp={disp} />
        </div>
      </section>

      {/* 4.4 Frustración */}
      <section>
        <h2 className="font-display text-fluid-xl">Señales de frustración</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ordenadas por frecuencia. Cada una con qué hacer.
        </p>
        {frustracion.length === 0 ? (
          <Vacia texto="Aún no hay señales de frustración detectadas." />
        ) : (
          <ul className="mt-5 space-y-3">
            {frustracion.slice(0, 12).map((f, i) => {
              const t = frustracionTexto(f);
              return (
                <li key={i} className="rounded-lg border border-border bg-background p-5">
                  <p className="text-sm text-foreground">{t.texto}</p>
                  <p className="mt-2 text-sm text-bl-gold-deep">→ {t.sugerencia}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 4.5 Embudo */}
      <section>
        <h2 className="font-display text-fluid-xl">Embudo de conversión</h2>
        <Embudo embudo={embudo} />
      </section>

      {/* 4.6 Recorridos */}
      <section>
        <h2 className="font-display text-fluid-xl">Recorridos más comunes</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <ListaRutas titulo="Todos los visitantes" rutas={recorridos.top} />
          <ListaRutas
            titulo="Los que se fueron sin hacer nada"
            rutas={recorridos.noConvirtieron}
            destacar
          />
        </div>
      </section>
    </div>
  );
}

function Cifra({ titulo, valor, nota }: { titulo: string; valor: string; nota?: string | null }) {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{titulo}</p>
      <p className="mt-2 font-display text-3xl text-bl-charcoal">{valor}</p>
      {nota && <p className="mt-1 text-xs text-muted-foreground">{nota} vs. semana anterior</p>}
    </div>
  );
}

function Vacia({ texto }: { texto: string }) {
  return (
    <div className="mt-5 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {texto}
    </div>
  );
}

// 4.2 Mapa de calor (rejilla de densidad de clics)
function MapaCalor({ data, path, disp }: { data: Inteligencia; path: string; disp: string }) {
  const cells = data.clicks.filter((c) => c.path === path && c.disp === disp);
  const max = cells.reduce((m, c) => Math.max(m, c.conteo), 0);
  const rejilla = useMemo(() => {
    const grid: Record<string, number> = {};
    for (const c of cells) grid[`${c.gx}_${c.gy}`] = c.conteo;
    return grid;
  }, [cells]);

  return (
    <div>
      <h3 className="text-fluid-base font-medium">Mapa de calor de clics</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Dónde hace clic la gente en {path}. Más intenso = más clics.
      </p>
      {max === 0 ? (
        <Vacia texto="Sin clics registrados en esta página todavía." />
      ) : (
        <div
          className="mt-4 grid overflow-hidden rounded-lg border border-border bg-bl-marble"
          style={{ gridTemplateColumns: "repeat(20, 1fr)", aspectRatio: "20 / 40" }}
        >
          {Array.from({ length: 20 * 40 }).map((_, i) => {
            const gx = i % 20;
            const gy = Math.floor(i / 20);
            const v = rejilla[`${gx}_${gy}`] ?? 0;
            const o = v ? 0.15 + (v / max) * 0.85 : 0;
            return (
              <div
                key={i}
                title={v ? `${v} clics` : ""}
                style={{ backgroundColor: v ? `rgba(193,150,90,${o})` : "transparent" }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// 4.3 Mapa de scroll
function MapaScroll({ data, path, disp }: { data: Inteligencia; path: string; disp: string }) {
  const rows = data.scroll.filter((s) => s.path === path && s.disp === disp);
  const total = rows.reduce((a, r) => a + r.sesiones, 0);
  // % que ALCANZÓ al menos cada profundidad
  const niveles = [0, 25, 50, 75, 100].map((depth) => {
    const alcanzaron = rows.filter((r) => r.depth >= depth).reduce((a, r) => a + r.sesiones, 0);
    return { depth, pct: total ? Math.round((alcanzaron / total) * 100) : 0 };
  });
  const pliegue = niveles.find((n) => n.pct <= 50)?.depth ?? 100;

  return (
    <div>
      <h3 className="text-fluid-base font-medium">Mapa de scroll</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Hasta dónde baja la gente en {path}.
      </p>
      {total === 0 ? (
        <Vacia texto="Sin datos de scroll para esta página todavía." />
      ) : (
        <div className="mt-4 space-y-2">
          {niveles.map((n) => (
            <div key={n.depth} className="flex items-center gap-3">
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{n.depth}%</span>
              <div className="h-6 flex-1 overflow-hidden rounded bg-bl-marble">
                <div
                  className={`h-full ${n.depth === pliegue ? "bg-bl-gold-deep" : "bg-bl-gold/70"}`}
                  style={{ width: `${n.pct}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-xs text-muted-foreground">{n.pct}%</span>
            </div>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            Pliegue promedio: cerca del <strong className="text-bl-charcoal">{pliegue}%</strong> se
            va la mitad de la gente. Lo que está debajo casi nadie lo ve.
          </p>
        </div>
      )}
    </div>
  );
}

function Embudo({ embudo }: { embudo: { paso: string; sesiones: number }[] }) {
  const base = embudo[0]?.sesiones || 0;
  let peorDrop = { i: -1, drop: 0 };
  for (let i = 1; i < embudo.length; i++) {
    const prev = embudo[i - 1].sesiones;
    const drop = prev ? (prev - embudo[i].sesiones) / prev : 0;
    if (drop > peorDrop.drop && prev > 0) peorDrop = { i, drop };
  }
  if (base === 0) return <Vacia texto="Aún no hay datos de embudo." />;
  return (
    <div className="mt-5 space-y-2">
      {embudo.map((e, i) => {
        const pct = base ? Math.round((e.sesiones / base) * 100) : 0;
        const prev = i > 0 ? embudo[i - 1].sesiones : e.sesiones;
        const caida = i > 0 && prev ? Math.round(((prev - e.sesiones) / prev) * 100) : 0;
        return (
          <div key={e.paso}>
            <div className="flex items-center justify-between text-sm">
              <span>{pasoLabel(e.paso)}</span>
              <span className="text-muted-foreground">
                {e.sesiones} · {pct}%
              </span>
            </div>
            <div className="mt-1 h-5 overflow-hidden rounded bg-bl-marble">
              <div className="h-full bg-bl-gold/70" style={{ width: `${pct}%` }} />
            </div>
            {i === peorDrop.i && caida > 0 && (
              <p className="mt-1 text-xs text-bl-gold-deep">
                ↓ Aquí se cae el {caida}% — el punto donde más se pierde.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ListaRutas({ titulo, rutas, destacar }: { titulo: string; rutas: { ruta: string; conteo: number }[]; destacar?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${destacar ? "border-bl-gold/50 bg-bl-marble/40" : "border-border bg-background"}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{titulo}</p>
      {rutas.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Sin datos todavía.</p>
      ) : (
        <ol className="mt-3 space-y-2 text-sm">
          {rutas.map((r, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="break-all">{r.ruta}</span>
              <span className="shrink-0 text-muted-foreground">{r.conteo}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
