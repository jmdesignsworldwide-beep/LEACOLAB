import { createPublicClient } from "@/lib/supabase/public";

/**
 * Lee un valor de la tabla `contenido` por clave. Devuelve null si no existe
 * o si no hay credenciales (para que la sección muestre su estado vacío).
 */
export async function getContenido<T = Record<string, unknown>>(
  clave: string
): Promise<T | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("contenido")
      .select("valor")
      .eq("clave", clave)
      .maybeSingle();
    return (data?.valor as T) ?? null;
  } catch {
    return null;
  }
}

export type HeroContenido = {
  kicker?: string;
  titulo?: string[] | string; // arreglo = una línea por elemento
  subtitulo?: string;
  imagen_path?: string; // en bucket `publico`
  cta_primario?: string;
  cta_secundario?: string;
};

export type SantuarioContenido = {
  kicker?: string;
  titulo?: string;
  parrafo?: string;
  lema?: string;
  imagen_path?: string; // en bucket `publico`
};
