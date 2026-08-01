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

export type CasoDestacado = {
  id: string;
  condicion: string;
  imagen_antes_path: string | null;
  imagen_despues_path: string | null;
  semana_tratamiento: number | null;
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

export async function getCasoDestacado(): Promise<CasoDestacado | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("casos")
      .select("id, condicion, imagen_antes_path, imagen_despues_path, semana_tratamiento")
      .eq("publicado", true)
      .is("deleted_at", null)
      .not("imagen_antes_path", "is", null)
      .not("imagen_despues_path", "is", null)
      .order("orden", { ascending: true })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}
