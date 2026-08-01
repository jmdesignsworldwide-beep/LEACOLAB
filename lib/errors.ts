/**
 * Manejo de errores del lado del servidor.
 *
 * REGLA FORT KNOX: al usuario NUNCA se le muestra detalle técnico (errores de
 * Supabase/Postgres, nombres de tablas, códigos, trazas). El error completo se
 * registra en el servidor; a la persona se le da un mensaje humano y, si acaso,
 * un código de referencia corto y opaco para soporte.
 */

/** Código de referencia corto y opaco (no revela nada de la estructura). */
export function refCode(): string {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase();
  const b = Date.now().toString(36).slice(-3).toUpperCase();
  return `BL-${a}${b}`;
}

/** Registra el error real SOLO en el servidor, asociado a su código. */
export function logServerError(
  contexto: string,
  error: unknown,
  ref: string
): void {
  // Este console.error va a los logs del servidor (Vercel), nunca a la pantalla.
  console.error(`[${ref}] ${contexto}:`, error);
}
