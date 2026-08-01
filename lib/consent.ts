/**
 * Texto de consentimiento para contacto (Ley 172-13). Es un artefacto legal:
 * la versión y el texto viven juntos en código para que lo que se guarda
 * (`consentimiento_texto_version`) siempre corresponda con lo que la persona
 * leyó. Al cambiar el texto, sube la versión.
 */
export const CONSENT_LEAD = {
  version: "2026-08-lead-v1",
  texto:
    "Autorizo a Beauty by Leela a contactarme por WhatsApp o correo para dar seguimiento a mi diagnóstico. Mis datos se tratan de forma confidencial, no se comparten con terceros y puedo pedir su eliminación cuando quiera.",
} as const;
