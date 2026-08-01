import { createClient } from "@supabase/supabase-js";

/**
 * Cliente anónimo sin sesión, para LEER contenido público del sitio
 * (RLS: solo lo publicado). No usa cookies → permite cache/ISR en las
 * páginas públicas. Devuelve null si faltan credenciales (build local).
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
