import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role — SOLO servidor. Bypassa RLS: úsalo únicamente en
 * flujos server-side controlados (p. ej. rate-limit del login y bitácora).
 * La llave NUNCA lleva prefijo NEXT_PUBLIC_ ni se expone al cliente.
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
