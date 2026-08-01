import { createPublicClient } from "@/lib/supabase/public";

export type ProtocoloCard = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  para_quien: string | null;
  imagen_path: string | null;
  inversion_min: number | null;
  inversion_max: number | null;
};

export async function getProtocolosDestacados(
  limite = 3
): Promise<ProtocoloCard[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("protocolos")
      .select(
        "id, slug, nombre, descripcion, para_quien, imagen_path, inversion_min, inversion_max"
      )
      .eq("publicado", true)
      .is("deleted_at", null)
      .order("orden", { ascending: true })
      .limit(limite);
    return data ?? [];
  } catch {
    return [];
  }
}

export type EspecialistaCard = {
  id: string;
  nombre: string;
  especialidad: string | null;
  anios: number | null;
  bio: string | null;
  foto_path: string | null;
};

export async function getEspecialistas(): Promise<EspecialistaCard[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("especialistas")
      .select("id, nombre, especialidad, anios, bio, foto_path")
      .eq("publicado", true)
      .is("deleted_at", null)
      .order("orden", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export type Fase = {
  id: string;
  numero: number;
  nombre: string;
  descripcion: string | null;
  duracion_texto: string | null;
  orden: number;
};

export type Protocolo = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  para_quien: string | null;
  imagen_path: string | null;
  inversion_min: number | null;
  inversion_max: number | null;
  incluye: string[];
  no_incluye: string[];
  duracion_texto: string | null;
  fases: Fase[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizaProtocolo(row: any): Protocolo {
  const fases: Fase[] = (row.fases_protocolo ?? [])
    .filter((f: any) => !f.deleted_at)
    .sort((a: any, b: any) => (a.orden - b.orden) || (a.numero - b.numero))
    .map((f: any) => ({
      id: f.id,
      numero: f.numero,
      nombre: f.nombre,
      descripcion: f.descripcion,
      duracion_texto: f.duracion_texto,
      orden: f.orden,
    }));
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    descripcion: row.descripcion,
    para_quien: row.para_quien,
    imagen_path: row.imagen_path,
    inversion_min: row.inversion_min,
    inversion_max: row.inversion_max,
    incluye: row.incluye ?? [],
    no_incluye: row.no_incluye ?? [],
    duracion_texto: row.duracion_texto,
    fases,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const SELECT_PROTOCOLO =
  "id, slug, nombre, descripcion, para_quien, imagen_path, inversion_min, inversion_max, incluye, no_incluye, duracion_texto, fases_protocolo(id, numero, nombre, descripcion, duracion_texto, orden, deleted_at)";

export async function getProtocolos(): Promise<Protocolo[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("protocolos")
      .select(SELECT_PROTOCOLO)
      .eq("publicado", true)
      .is("deleted_at", null)
      .order("orden", { ascending: true });
    return (data ?? []).map(normalizaProtocolo);
  } catch {
    return [];
  }
}

export async function getProtocoloPorSlug(
  slug: string
): Promise<Protocolo | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("protocolos")
      .select(SELECT_PROTOCOLO)
      .eq("slug", slug)
      .eq("publicado", true)
      .is("deleted_at", null)
      .maybeSingle();
    return data ? normalizaProtocolo(data) : null;
  } catch {
    return null;
  }
}

// Los casos (antes/después) viven en el bucket privado y se sirven con URLs
// firmadas → ver lib/casos.ts.
