"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { CONSENT_LEAD } from "@/lib/consent";
import {
  focoRecomendado,
  respuestasCompletas,
  type RespuestasQuiz,
} from "@/lib/diagnostico";

/**
 * Registra la finalización del diagnóstico como evento ANÓNIMO (inteligencia
 * agregada). Nunca incluye datos personales — solo las respuestas del quiz.
 */
export async function registrarDiagnostico(
  respuestas: RespuestasQuiz
): Promise<void> {
  if (!respuestasCompletas(respuestas)) return;
  const sb = createPublicClient();
  if (!sb) return;
  try {
    await sb.from("eventos").insert({
      tipo: "diagnostico_completado",
      path: "/diagnostico",
      meta: { ...respuestas, foco: focoRecomendado(respuestas) },
    });
  } catch {
    // Silencioso: el diagnóstico funciona igual aunque falle la analítica.
  }
}

export type LeadInput = {
  respuestas: RespuestasQuiz;
  nombre: string;
  whatsapp: string;
  correo: string;
  consentimiento: boolean;
  // Honeypot: debe llegar vacío. Si trae algo, es un bot.
  sitio_web?: string;
};

export type LeadResultado = { ok: true } | { ok: false; error: string };

function contactoValido(whatsapp: string, correo: string): boolean {
  const wsOk = whatsapp.replace(/\D/g, "").length >= 7;
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  return wsOk || mailOk;
}

/**
 * Guarda un lead SOLO cuando la persona pide contacto y da su consentimiento.
 * Inserta con el cliente anónimo → el RLS exige `consentimiento_contacto=true`.
 */
export async function enviarLead(input: LeadInput): Promise<LeadResultado> {
  // Honeypot
  if (input.sitio_web && input.sitio_web.trim() !== "") {
    return { ok: true }; // fingir éxito para el bot
  }
  if (!input.consentimiento) {
    return { ok: false, error: "Necesitamos tu autorización para contactarte." };
  }
  if (!respuestasCompletas(input.respuestas)) {
    return { ok: false, error: "Faltan respuestas del diagnóstico." };
  }
  const nombre = input.nombre.trim();
  const whatsapp = input.whatsapp.trim();
  const correo = input.correo.trim();
  if (!nombre) {
    return { ok: false, error: "Dinos tu nombre, por favor." };
  }
  if (!contactoValido(whatsapp, correo)) {
    return {
      ok: false,
      error: "Déjanos un WhatsApp o correo válido para contactarte.",
    };
  }

  const sb = createPublicClient();
  if (!sb) {
    return { ok: false, error: "No pudimos enviar tu solicitud. Intenta luego." };
  }

  const r = input.respuestas;
  try {
    const { error } = await sb.from("leads_diagnostico").insert({
      segmento: r.segmento,
      antiguedad: r.antiguedad,
      intento_previo: r.intento_previo,
      tipo_piel: r.tipo_piel,
      urgencia: r.urgencia,
      busca_formacion: r.busca_formacion === "si",
      protocolo_sugerido: focoRecomendado(r),
      nombre,
      whatsapp: whatsapp || null,
      correo: correo || null,
      consentimiento_contacto: true,
      consentimiento_texto_version: CONSENT_LEAD.version,
    });
    if (error) {
      return { ok: false, error: "No pudimos enviar tu solicitud. Intenta luego." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "No pudimos enviar tu solicitud. Intenta luego." };
  }
}
