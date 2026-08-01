"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { CONSENT_CONTACTO } from "@/lib/consent";
import { refCode, logServerError } from "@/lib/errors";

export type MensajeInput = {
  nombre: string;
  contacto: string; // WhatsApp o correo
  mensaje: string;
  consentimiento: boolean;
  sitio_web?: string; // honeypot
};

export type FormResultado =
  | { ok: true }
  | { ok: false; error: string; ref?: string };

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
  const errMsg = "No pudimos enviar tu mensaje en este momento.";
  if (!sb) {
    const ref = refCode();
    logServerError("enviarMensaje: sin cliente Supabase", "missing env", ref);
    return { ok: false, error: errMsg, ref };
  }

  try {
    const { error } = await sb.from("mensajes_contacto").insert({
      nombre,
      contacto,
      mensaje,
      origen: "contacto",
      consentimiento_contacto: true,
      consentimiento_texto_version: CONSENT_CONTACTO.version,
    });
    if (error) {
      const ref = refCode();
      logServerError("enviarMensaje: insert", error, ref);
      return { ok: false, error: errMsg, ref };
    }
    return { ok: true };
  } catch (e) {
    const ref = refCode();
    logServerError("enviarMensaje: excepción", e, ref);
    return { ok: false, error: errMsg, ref };
  }
}
