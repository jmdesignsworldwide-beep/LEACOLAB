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

export type SeccionEncabezado = {
  kicker?: string;
  titulo?: string;
  cta_texto?: string;
};

export type NosotrasContenido = {
  kicker?: string;
  titulo?: string;
  historia?: string[] | string; // párrafos
  foto_path?: string;
};

export type MedicoContenido = {
  activo?: boolean; // false/ausente → estado vacío "en preparación"
  nombre?: string;
  credenciales?: string;
  bio?: string;
  foto_path?: string;
};

export type AgendarAviso = {
  titulo?: string;
  puntos?: string[]; // precio 1ra cita, depósito RD$1,000, WhatsApp con código, evaluada por Marianny
  nota?: string;
  cta_texto?: string;
};

export type PrimeraCita = {
  monto_texto?: string; // "RD$ 3,000"
  equivalente?: string; // "US$ 50"
  nota?: string; // "el plan exacto se define en la evaluación…"
};

export type SantuarioContenido = {
  kicker?: string;
  titulo?: string;
  parrafo?: string;
  lema?: string;
  imagen_path?: string; // en bucket `publico`
};
