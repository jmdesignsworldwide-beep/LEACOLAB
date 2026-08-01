/**
 * Validadores de formulario con redacción humana (dominicano natural).
 * Devuelven el mensaje de error, o null si el campo está bien.
 * Se usan en vivo (al salir del campo) y al enviar.
 */

const soloDigitos = (v: string) => v.replace(/\D/g, "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function valNombre(v: string): string | null {
  return v.trim() ? null : "Necesitamos tu nombre para saber cómo llamarte";
}

/** WhatsApp dominicano: 10 dígitos. Vacío se permite si `requerido` es false. */
export function valWhatsapp(v: string, requerido = false): string | null {
  const d = soloDigitos(v);
  if (!d) return requerido ? "Déjanos tu WhatsApp para contactarte" : null;
  return d.length === 10 ? null : "Ese número no parece completo — son 10 dígitos";
}

export function valCorreo(v: string, requerido = false): string | null {
  if (!v.trim()) return requerido ? "Déjanos tu correo" : null;
  return EMAIL.test(v.trim()) ? null : "Revisa el correo, parece que falta algo";
}

/** Un solo campo que acepta WhatsApp o correo (página de contacto). */
export function valContactoLibre(v: string): string | null {
  const t = v.trim();
  if (!t) return "Déjanos un WhatsApp o correo para responderte";
  const d = soloDigitos(t);
  if (EMAIL.test(t)) return null;
  if (d.length >= 10) return null;
  return "Escribe un WhatsApp (10 dígitos) o un correo válido";
}

export function valMensaje(v: string): string | null {
  return v.trim() ? null : "Escríbenos tu mensaje";
}

/** Al menos uno de WhatsApp o correo (diagnóstico / formación). */
export function valAlMenosContacto(
  whatsapp: string,
  correo: string
): string | null {
  const wsOk = soloDigitos(whatsapp).length === 10;
  const mailOk = EMAIL.test(correo.trim());
  return wsOk || mailOk
    ? null
    : "Déjanos un WhatsApp o correo para poder contactarte";
}

export function valConsentimiento(aceptado: boolean): string | null {
  return aceptado ? null : "Necesitamos tu autorización para contactarte";
}
