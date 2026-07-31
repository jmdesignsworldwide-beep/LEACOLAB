"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VENTANA_MIN = 15;
const ALERTA_UMBRAL = 9; // a partir del 10º fallo del correo, avisar a la admin
const FP_COOKIE = "bl_fp";

export type LoginState = { error: string } | null;

// Retraso progresivo por número de fallos de ESTA huella de sesión.
// 1,2,4,8,16,32,60s… — mata la fuerza bruta sin bloquear a nadie.
function esperaSegundos(fallos: number): number {
  if (fallos <= 0) return 0;
  return Math.min(60, 2 ** (fallos - 1));
}

async function obtenerHuella(): Promise<string> {
  const store = await cookies();
  let fp = store.get(FP_COOKIE)?.value;
  if (!fp) {
    fp = randomUUID();
    store.set(FP_COOKIE, fp, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return fp;
}

/**
 * Login del portal (pilar 6 de Fort Knox), server-side:
 * - Retraso PROGRESIVO por huella de sesión (no bloqueo duro por correo, que
 *   podría usarse para sabotear a la clienta con su correo público).
 * - Intentos en audit_log (correo + huella + resultado, sin contraseña).
 * - Aviso a la admin (login_alerta) ante fallos repetidos del correo.
 * - Error genérico: nunca distingue "correo inexistente" de "clave incorrecta".
 * - `service_role` solo para audit_log pre-sesión; la autorización post-login
 *   se valida con la sesión real del usuario (RLS).
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

  const fp = await obtenerHuella();
  const admin = createAdminClient();
  const ahora = Date.now();
  const desde = new Date(ahora - VENTANA_MIN * 60_000).toISOString();

  // Retraso progresivo según fallos recientes de esta huella
  const { data: fallosFp } = await admin
    .from("audit_log")
    .select("created_at")
    .eq("tabla", "auth")
    .eq("accion", "login_fail")
    .contains("diff", { fp })
    .gt("created_at", desde)
    .order("created_at", { ascending: false });

  const nFp = fallosFp?.length ?? 0;
  if (nFp > 0) {
    const espera = esperaSegundos(nFp);
    const transcurrido = (ahora - new Date(fallosFp![0].created_at).getTime()) / 1000;
    if (transcurrido < espera) {
      return {
        error: `Demasiados intentos. Espera ${Math.ceil(
          espera - transcurrido
        )} s e intenta de nuevo.`,
      };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await admin.from("audit_log").insert({
      accion: "login_fail",
      tabla: "auth",
      registro_id: email,
      diff: { fp },
    });
    // Aviso a la admin si el correo acumula muchos fallos (posible ataque)
    const { count } = await admin
      .from("audit_log")
      .select("*", { count: "exact", head: true })
      .eq("tabla", "auth")
      .eq("accion", "login_fail")
      .eq("registro_id", email)
      .gt("created_at", desde);
    if ((count ?? 0) >= ALERTA_UMBRAL) {
      await admin.from("audit_log").insert({
        accion: "login_alerta",
        tabla: "auth",
        registro_id: email,
        diff: { motivo: "intentos_repetidos" },
      });
    }
    return { error: "Credenciales incorrectas." };
  }

  // Autorización con la SESIÓN del usuario (RLS): debe existir fila activa.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase
    .from("usuarios_portal")
    .select("activo")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (!perfil || !perfil.activo) {
    await supabase.auth.signOut();
    await admin.from("audit_log").insert({
      accion: "login_denegado",
      tabla: "auth",
      registro_id: email,
      diff: { fp },
    });
    return { error: "Tu cuenta no tiene acceso al portal." };
  }

  await admin.from("audit_log").insert({
    accion: "login_ok",
    tabla: "auth",
    registro_id: email,
    diff: { fp },
  });

  redirect("/portal");
}
