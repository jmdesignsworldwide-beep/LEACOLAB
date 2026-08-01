"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { CONSENT_INSCRIPCION } from "@/lib/consent";

export type InscripcionInput = {
  programaId: string;
  nombre: string;
  whatsapp: string;
  correo: string;
  mensaje: string;
  consentimiento: boolean;
  sitio_web?: string; // honeypot
};

export type FormResultado = { ok: true } | { ok: false; error: string };

function contactoValido(whatsapp: string, correo: string): boolean {
  const wsOk = whatsapp.replace(/\D/g, "").length >= 7;
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  return wsOk || mailOk;
}

export async function enviarInscripcion(
  input: InscripcionInput
): Promise<FormResultado> {
  if (input.sitio_web && input.sitio_web.trim() !== "") return { ok: true };
  if (!input.consentimiento)
    return { ok: false, error: "Necesitamos tu autorización para contactarte." };

  const nombre = input.nombre.trim();
  const whatsapp = input.whatsapp.trim();
  const correo = input.correo.trim();
  if (!nombre) return { ok: false, error: "Dinos tu nombre, por favor." };
  if (!contactoValido(whatsapp, correo))
    return { ok: false, error: "Déjanos un WhatsApp o correo válido." };

  const sb = createPublicClient();
  if (!sb)
    return { ok: false, error: "No pudimos enviar tu solicitud. Intenta luego." };

  try {
    const { error } = await sb.from("inscripciones_formacion").insert({
      programa_id: input.programaId || null,
      nombre,
      whatsapp: whatsapp || null,
      correo: correo || null,
      mensaje: input.mensaje.trim() || null,
      consentimiento_contacto: true,
      consentimiento_texto_version: CONSENT_INSCRIPCION.version,
    });
    if (error)
      return { ok: false, error: "No pudimos enviar tu solicitud. Intenta luego." };
    return { ok: true };
  } catch {
    return { ok: false, error: "No pudimos enviar tu solicitud. Intenta luego." };
  }
}
