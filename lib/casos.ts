import { createPublicClient } from "@/lib/supabase/public";

/**
 * Casos (antes/después) de la galería de transformaciones.
 *
 * Las fotos viven en el bucket PRIVADO `casos`. Nunca se sirven por URL
 * pública: se generan URLs firmadas de corta duración en el servidor. El RLS
 * de storage solo permite firmar imágenes que pertenecen a un caso publicado
 * (ver migración 0004), así que la base decide qué se puede mostrar.
 */

export type CasoGaleria = {
  id: string;
  condicion: string;
  semana_tratamiento: number | null;
  notas: string | null;
  protocolo_nombre: string | null;
  protocolo_slug: string | null;
  antes: string | null; // URL firmada
  despues: string | null; // URL firmada
};

// La URL firmada dura más que la ventana de revalidación (300s) para que la
// página en caché siga mostrando imágenes válidas hasta que se regenere.
const FIRMA_SEGUNDOS = 60 * 60; // 1 hora

const SELECT_CASO =
  "id, condicion, semana_tratamiento, notas, imagen_antes_path, imagen_despues_path, orden, protocolos(nombre, slug)";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function firmarCasos(sb: any, rows: any[]): Promise<CasoGaleria[]> {
  const paths = Array.from(
    new Set(
      rows
        .flatMap((r) => [r.imagen_antes_path, r.imagen_despues_path])
        .filter((p): p is string => Boolean(p))
    )
  );

  const firmadas = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await sb.storage
      .from("casos")
      .createSignedUrls(paths, FIRMA_SEGUNDOS);
    for (const s of data ?? []) {
      if (s?.path && s?.signedUrl) firmadas.set(s.path, s.signedUrl);
    }
  }

  return rows.map((r) => {
    const proto = Array.isArray(r.protocolos) ? r.protocolos[0] : r.protocolos;
    return {
      id: r.id,
      condicion: r.condicion,
      semana_tratamiento: r.semana_tratamiento,
      notas: r.notas ?? null,
      protocolo_nombre: proto?.nombre ?? null,
      protocolo_slug: proto?.slug ?? null,
      antes: r.imagen_antes_path ? firmadas.get(r.imagen_antes_path) ?? null : null,
      despues: r.imagen_despues_path
        ? firmadas.get(r.imagen_despues_path) ?? null
        : null,
    };
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Toda la galería: casos publicados con ambas imágenes. */
export async function getCasosGaleria(): Promise<CasoGaleria[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("casos")
    .select(SELECT_CASO)
    .eq("publicado", true)
    .is("deleted_at", null)
    .not("imagen_antes_path", "is", null)
    .not("imagen_despues_path", "is", null)
    .order("orden", { ascending: true });
  if (error) throw new Error("No se pudieron cargar las transformaciones");
  const casos = await firmarCasos(sb, data ?? []);
  // Solo los que quedaron con ambas URLs firmadas correctamente.
  return casos.filter((c) => c.antes && c.despues);
}

/** Casos de un protocolo concreto (para la página de detalle). */
export async function getCasosGaleriaPorProtocolo(
  protocoloId: string
): Promise<CasoGaleria[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("casos")
    .select(SELECT_CASO)
    .eq("publicado", true)
    .is("deleted_at", null)
    .eq("protocolo_id", protocoloId)
    .not("imagen_antes_path", "is", null)
    .not("imagen_despues_path", "is", null)
    .order("orden", { ascending: true });
  if (error) throw new Error("No se pudieron cargar las transformaciones");
  const casos = await firmarCasos(sb, data ?? []);
  return casos.filter((c) => c.antes && c.despues);
}

/** Un caso destacado (el primero publicado) para el preview del home. */
export async function getCasoDestacadoGaleria(): Promise<CasoGaleria | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("casos")
    .select(SELECT_CASO)
    .eq("publicado", true)
    .is("deleted_at", null)
    .not("imagen_antes_path", "is", null)
    .not("imagen_despues_path", "is", null)
    .order("orden", { ascending: true })
    .limit(1);
  if (error) throw new Error("No se pudieron cargar las transformaciones");
  const casos = await firmarCasos(sb, data ?? []);
  return casos.find((c) => c.antes && c.despues) ?? null;
}

/** Lista única de condiciones presentes, para el filtro. */
export function condicionesDe(casos: CasoGaleria[]): string[] {
  return Array.from(new Set(casos.map((c) => c.condicion).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, "es")
  );
}
