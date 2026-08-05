/**
 * Marca una conversión desde el código (éxito de formulario, fin del
 * diagnóstico). Solo nombres controlados por nosotros; nunca datos personales.
 * Si el capturador no está cargado (dev/preview/portal), no hace nada.
 */
export function marcarEvento(nombre: string): void {
  if (typeof window === "undefined") return;
  (window as unknown as { __blTrack?: (n: string) => void }).__blTrack?.(nombre);
}
