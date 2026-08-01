"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { rutaSubida } from "@/lib/storage";
import { requirePortalUser } from "@/lib/portal";

export type FormState = { error: string } | null;

export async function guardarEspecialista(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requirePortalUser(); // exige sesión + rol activo; el RLS hace el resto
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const nombre = String(formData.get("nombre") || "").trim();
  const especialidad = String(formData.get("especialidad") || "").trim() || null;
  const aniosRaw = String(formData.get("anios") || "").trim();
  const anios = aniosRaw ? Number(aniosRaw) : null;
  const bio = String(formData.get("bio") || "").trim() || null;
  const orden = Number(formData.get("orden") || 0) || 0;
  const publicado = formData.get("publicado") === "on";

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (aniosRaw && Number.isNaN(anios)) return { error: "Los años deben ser un número." };

  const datos: Record<string, unknown> = {
    nombre,
    especialidad,
    anios,
    bio,
    orden,
    publicado,
  };

  const foto = formData.get("foto");
  if (foto instanceof File && foto.size > 0) {
    if (!foto.type.startsWith("image/"))
      return { error: "El archivo debe ser una imagen." };
    const path = rutaSubida("especialistas", foto.name);
    const { error: upErr } = await supabase.storage
      .from("publico")
      .upload(path, foto, { contentType: foto.type, upsert: false });
    if (upErr) return { error: "No se pudo subir la foto: " + upErr.message };
    datos.foto_path = path;
  }

  if (id) {
    const { error } = await supabase.from("especialistas").update(datos).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("especialistas").insert(datos);
    if (error) return { error: error.message };
  }

  revalidatePath("/portal/especialistas");
  redirect("/portal/especialistas");
}

export async function eliminarEspecialista(formData: FormData) {
  await requirePortalUser();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  // Soft-delete (la editora puede; el borrado definitivo queda para admin).
  await supabase
    .from("especialistas")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/portal/especialistas");
}
