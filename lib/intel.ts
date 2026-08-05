import { createClient } from "@/lib/supabase/server";
import type {
  Inteligencia,
  GeoRow,
  ClickRow,
  ScrollRow,
  RecorridoRow,
  FrustRow,
} from "@/lib/intel-tipos";

export type { Inteligencia } from "@/lib/intel-tipos";

/**
 * Lectura de los agregados de inteligencia para el panel. Usa el cliente de
 * SESIÓN → el RLS solo deja leer a admin (la editora no ve analítica). Todo se
 * lee de las tablas `intel_*` (agregado), nunca del crudo.
 */

function fechaISO(offsetDias: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDias);
  return d.toISOString().slice(0, 10);
}

const vacio: Inteligencia = {
  hayDatos: false,
  resumen: { sesiones: 0, vistas: 0, msProm: 0, movil: 0, escritorio: 0, sesionesPrevias: 0 },
  geo: [],
  clicks: [],
  scroll: [],
  secciones: [],
  frustracion: [],
  embudo: [],
  recorridos: { top: [], noConvirtieron: [] },
  paths: [],
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getInteligencia(dias = 7): Promise<Inteligencia> {
  const sb = await createClient();
  const desde = fechaISO(dias);
  const desdePrev = fechaISO(dias * 2);

  const q = (t: string, cols = "*") =>
    sb.from(t).select(cols).gte("fecha", desde);

  const [res, resPrev, geo, clicks, scroll, secc, frust, emb, rec] =
    await Promise.all([
      q("intel_resumen"),
      sb.from("intel_resumen").select("sesiones,fecha").gte("fecha", desdePrev).lt("fecha", desde),
      q("intel_geo"),
      q("intel_clicks"),
      q("intel_scroll"),
      q("intel_secciones"),
      q("intel_frustracion"),
      q("intel_embudo"),
      q("intel_recorridos"),
    ]);

  const resumenRows = (res.data as any[]) ?? [];
  if (resumenRows.length === 0) return vacio;

  const sesiones = resumenRows.reduce((a, r) => a + r.sesiones, 0);
  const vistas = resumenRows.reduce((a, r) => a + r.vistas, 0);
  const msTotal = resumenRows.reduce((a, r) => a + Number(r.ms_total), 0);
  const movil = resumenRows.filter((r) => r.disp === "m").reduce((a, r) => a + r.sesiones, 0);
  const sesionesPrevias = ((resPrev.data as any[]) ?? []).reduce((a, r) => a + r.sesiones, 0);

  // geo agregado por ciudad
  const geoMap = new Map<string, GeoRow>();
  for (const g of (geo.data as any[]) ?? []) {
    const k = `${g.pais}|${g.region}|${g.ciudad}`;
    const prev = geoMap.get(k);
    if (prev) prev.sesiones += g.sesiones;
    else geoMap.set(k, { pais: g.pais, region: g.region, ciudad: g.ciudad, sesiones: g.sesiones });
  }

  // clicks: sumar por (path,disp,gx,gy,clase)
  const clickMap = new Map<string, ClickRow>();
  for (const c of (clicks.data as any[]) ?? []) {
    const k = `${c.path}|${c.disp}|${c.gx}|${c.gy}|${c.clase}`;
    const p = clickMap.get(k);
    if (p) p.conteo += c.conteo;
    else clickMap.set(k, { path: c.path, disp: c.disp, gx: c.gx, gy: c.gy, clase: c.clase, conteo: c.conteo });
  }

  // scroll: sumar por (path,disp,depth)
  const scrollMap = new Map<string, ScrollRow>();
  for (const s of (scroll.data as any[]) ?? []) {
    const k = `${s.path}|${s.disp}|${s.depth}`;
    const p = scrollMap.get(k);
    if (p) p.sesiones += s.sesiones;
    else scrollMap.set(k, { path: s.path, disp: s.disp, depth: s.depth, sesiones: s.sesiones });
  }

  // secciones: promedio ms
  const seccMap = new Map<string, { path: string; seccion: string; ms: number; n: number }>();
  for (const s of (secc.data as any[]) ?? []) {
    const k = `${s.path}|${s.seccion}`;
    const p = seccMap.get(k);
    if (p) { p.ms += Number(s.ms_total); p.n += s.muestras; }
    else seccMap.set(k, { path: s.path, seccion: s.seccion, ms: Number(s.ms_total), n: s.muestras });
  }

  // frustración: sumar
  const frustMap = new Map<string, FrustRow>();
  for (const f of (frust.data as any[]) ?? []) {
    const k = `${f.path}|${f.tipo}|${f.seccion}`;
    const p = frustMap.get(k);
    if (p) p.conteo += f.conteo;
    else frustMap.set(k, { path: f.path, tipo: f.tipo, seccion: f.seccion, conteo: f.conteo });
  }

  // embudo: sumar por paso
  const embMap = new Map<string, number>();
  for (const e of (emb.data as any[]) ?? [])
    embMap.set(e.paso, (embMap.get(e.paso) ?? 0) + e.sesiones);

  // recorridos: sumar por ruta+convirtio
  const rutaTop = new Map<string, number>();
  const rutaNo = new Map<string, number>();
  for (const r of (rec.data as any[]) ?? []) {
    const m = r.convirtio ? rutaTop : rutaNo;
    m.set(r.ruta, (m.get(r.ruta) ?? 0) + r.conteo);
    if (r.convirtio) rutaTop.set(r.ruta, (rutaTop.get(r.ruta) ?? 0)); // top incluye convertidos
  }
  // "top" general = todas las rutas por frecuencia; "noConvirtieron" solo las no convertidas
  const todas = new Map<string, number>();
  for (const r of (rec.data as any[]) ?? [])
    todas.set(r.ruta, (todas.get(r.ruta) ?? 0) + r.conteo);

  const orden = (m: Map<string, number>): RecorridoRow[] =>
    [...m.entries()].map(([ruta, conteo]) => ({ ruta, conteo }))
      .sort((a, b) => b.conteo - a.conteo).slice(0, 5);

  const paths = Array.from(new Set([...clickMap.values()].map((c) => c.path))).sort();

  return {
    hayDatos: true,
    resumen: {
      sesiones,
      vistas,
      msProm: sesiones ? Math.round(msTotal / sesiones) : 0,
      movil,
      escritorio: sesiones - movil,
      sesionesPrevias,
    },
    geo: [...geoMap.values()].sort((a, b) => b.sesiones - a.sesiones).slice(0, 8),
    clicks: [...clickMap.values()],
    scroll: [...scrollMap.values()],
    secciones: [...seccMap.values()].map((s) => ({ path: s.path, seccion: s.seccion, msProm: s.n ? Math.round(s.ms / s.n) : 0 })),
    frustracion: [...frustMap.values()].sort((a, b) => b.conteo - a.conteo),
    embudo: ["1_visita", "2_protocolos", "3_inicia_diagnostico", "4_termina_diagnostico", "5_deja_contacto", "6_agendar"]
      .map((paso) => ({ paso, sesiones: embMap.get(paso) ?? 0 })),
    recorridos: { top: orden(todas), noConvirtieron: orden(rutaNo) },
    paths,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
