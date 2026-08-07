import { NextResponse, type NextRequest } from "next/server";

import { createPublicClient } from "@/lib/supabase/public";

/**
 * Ingesta de eventos de comportamiento (lista blanca).
 *
 * - Solo acepta los `tipo` conocidos y saca solo las claves de meta conocidas
 *   (nunca texto libre, nunca contenido de formularios ni de imágenes).
 * - La geolocalización sale de los headers de Vercel: país/región/ciudad.
 *   NUNCA se guarda la IP.
 * - Inserta con el cliente anónimo → el RLS exige `tipo not null` (ins_eventos).
 * - Límite de tamaño de lote como cortafuegos anti-inundación.
 */

export const runtime = "nodejs";

const TIPOS = new Set([
  "pageview",
  "click",
  "scroll",
  "tiempo_seccion",
  "salida",
  "frustracion",
  "meta_evento",
]);

// Claves de meta permitidas y su tipo esperado.
const NUM = new Set(["x", "y", "depth", "ms", "depthv"]);
const STR = new Set(["seccion", "clase", "tipo", "ref", "nombre"]);

const MAX_LOTE = 60;
const MAX_STR = 40;

/* eslint-disable @typescript-eslint/no-explicit-any */
function limpiarMeta(meta: any): Record<string, string | number> | null {
  if (!meta || typeof meta !== "object") return null;
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(meta)) {
    const v = meta[k];
    if (NUM.has(k) && typeof v === "number" && Number.isFinite(v)) {
      out[k] = Math.max(-1, Math.min(100000, v));
    } else if (STR.has(k) && typeof v === "string") {
      out[k] = v.slice(0, MAX_STR);
    }
    // cualquier otra clave se descarta (lista blanca)
  }
  return out;
}

function limpiarPath(p: unknown): string {
  if (typeof p !== "string") return "/";
  // Solo la ruta, sin query ni fragmentos; acotada.
  return p.split("?")[0].split("#")[0].slice(0, 120) || "/";
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function POST(req: NextRequest) {
  let cuerpo: unknown;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const envelope = cuerpo as { eventos?: unknown; sid?: unknown; d?: unknown };
  const eventos = envelope?.eventos;
  if (!Array.isArray(eventos) || eventos.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // sid anónimo (solo para agrupar la visita) y dispositivo, acotados.
  const sid = typeof envelope.sid === "string" ? envelope.sid.slice(0, 20) : "";
  const disp = envelope.d === "m" ? "m" : "e";

  // Geo de Vercel — nunca IP.
  const pais = req.headers.get("x-vercel-ip-country") ?? "";
  const region = req.headers.get("x-vercel-ip-country-region") ?? "";
  const ciudad = decodeURIComponent(req.headers.get("x-vercel-ip-city") ?? "");

  const filas = eventos
    .slice(0, MAX_LOTE)
    .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === "object")
    .filter((e) => TIPOS.has(e.tipo as string))
    .map((e) => ({
      tipo: e.tipo as string,
      path: limpiarPath(e.path),
      pais: pais.slice(0, 4),
      region: region.slice(0, 8),
      ciudad: ciudad.slice(0, 60),
      meta: { ...(limpiarMeta(e.meta) ?? {}), sid, d: disp },
    }));

  if (filas.length === 0) {
    return NextResponse.json({ ok: true, n: 0 });
  }

  const sb = createPublicClient();
  if (!sb) return NextResponse.json({ ok: true, n: 0 }); // sin entorno → no-op

  // Inserta como anónimo; el RLS decide (ins_eventos: tipo not null).
  await sb.from("eventos").insert(filas);

  return NextResponse.json({ ok: true, n: filas.length });
}
