"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FALLOS = 5;
const VENTANA_MIN = 15;

export type LoginState = { error: string } | null;

/**
 * Login del portal con rate-limit server-side (pilar 6 de Fort Knox):
 * - Bloqueo por correo tras 5 fallos en 15 min (verificado en servidor).
 * - Cada intento se registra en audit_log (correo + resultado, sin contraseña).
 * - Error genérico: nunca distingue "correo inexistente" de "contraseña mala".
 */
export async function iniciarSesion(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Credenciales incorrectas." };

  const admin = createAdminClient();
  const desde = new Date(Date.now() - VENTANA_MIN * 60_000).toISOString();

  // Fallos recientes para este correo
  const { count } = await admin
    .from("audit_log")
    .select("*", { count: "exact", head: true })
    .eq("tabla", "auth")
    .eq("accion", "login_fail")
    .eq("registro_id", email)
    .gt("created_at", desde);

  if ((count ?? 0) >= MAX_FALLOS) {
    return {
      error: `Demasiados intentos. Espera ${VENTANA_MIN} minutos e intenta de nuevo.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await admin
      .from("audit_log")
      .insert({ accion: "login_fail", tabla: "auth", registro_id: email });
    return { error: "Credenciales incorrectas." };
  }

  // Autorización: debe existir fila activa en usuarios_portal
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await admin
    .from("usuarios_portal")
    .select("activo")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (!perfil || !perfil.activo) {
    await supabase.auth.signOut();
    await admin
      .from("audit_log")
      .insert({ accion: "login_denegado", tabla: "auth", registro_id: email });
    return { error: "Tu cuenta no tiene acceso al portal." };
  }

  await admin
    .from("audit_log")
    .insert({ accion: "login_ok", tabla: "auth", registro_id: email });

  redirect("/portal");
}
