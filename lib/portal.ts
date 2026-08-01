import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type RolPortal = "admin" | "editor";
export type PortalUser = {
  id: string;
  email: string;
  nombre: string;
  rol: RolPortal;
};

/**
 * Exige sesión válida + fila activa en usuarios_portal. Redirige al login
 * si no hay sesión o el usuario no está autorizado. Úsalo en el layout
 * protegido del portal y en las server actions.
 */
export async function requirePortalUser(): Promise<PortalUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: perfil } = await supabase
    .from("usuarios_portal")
    .select("nombre, rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil || !perfil.activo) {
    redirect("/portal/login?error=no-autorizado");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    nombre: perfil.nombre,
    rol: perfil.rol as RolPortal,
  };
}
