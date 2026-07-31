import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role — SOLO servidor. Bypassa RLS, así que su uso está
 * ESTRICTAMENTE limitado a operaciones que no pueden correr bajo la sesión del
 * usuario (pilar 3 de Fort Knox: el RLS, no la interfaz, decide).
 *
 * Usos justificados en el código (deben ser pocos; si crecen, arreglar RLS):
 *  1) Rate-limit del login: leer/escribir intentos en `audit_log` ANTES de que
 *     exista sesión. No hay usuario autenticado todavía, y `audit_log` es
 *     admin-only + append-only, así que no puede hacerse con la sesión.
 *
 * Todo lo demás del portal usa el cliente SSR con la sesión real del usuario,
 * de modo que el RLS aplica por rol.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
