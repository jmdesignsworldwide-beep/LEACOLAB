"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { CONSENT_CONTACTO } from "@/lib/consent";

export type MensajeInput = {
  nombre: string;
  contacto: string; // WhatsApp o correo
  mensaje: string;
  consentimiento: boolean;
  sitio_web?: string; // honeypot
};

export type FormResultado = { ok: true } | { ok: false; error: string };

export async function enviarMensaje(
  input: MensajeInput
): Promise<FormResultado> {
  if (input.sitio_web && input.sitio_web.trim() !== "") return { ok: true };
  if (!input.consentimiento)
    return { ok: false, error: "Necesitamos tu autorización para contactarte." };

  const nombre = input.nombre.trim();
  const contacto = input.contacto.trim();
  const mensaje = input.mensaje.trim();
  if (!nombre) return { ok: false, error: "Dinos tu nombre, por favor." };
  if (!contacto)
    return { ok: false, error: "Déjanos un WhatsApp o correo para responderte." };
  if (!mensaje) return { ok: false, error: "Escríbenos tu mensaje." };

  const sb = createPublicClient();
  if (!sb)
    return { ok: false, error: "No pudimos enviar tu mensaje. Intenta luego." };

  try {
    const { error } = await sb.from("mensajes_contacto").insert({
      nombre,
      contacto,
      mensaje,
      origen: "contacto",
      consentimiento_contacto: true,
      consentimiento_texto_version: CONSENT_CONTACTO.version,
    });
    if (error)
      return { ok: false, error: "No pudimos enviar tu mensaje. Intenta luego." };
    return { ok: true };
  } catch {
    return { ok: false, error: "No pudimos enviar tu mensaje. Intenta luego." };
  }
}
