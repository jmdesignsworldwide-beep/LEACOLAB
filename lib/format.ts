/** Formatea un monto en pesos dominicanos. */
export function formatoRD(n?: number | null): string | null {
  if (n == null) return null;
  return "RD$ " + new Intl.NumberFormat("es-DO", { maximumFractionDigits: 0 }).format(n);
}

/** Rango de inversión legible ("Desde RD$ X", "RD$ X – RD$ Y"). */
export function rangoInversion(
  min?: number | null,
  max?: number | null
): string | null {
  const a = formatoRD(min);
  const b = formatoRD(max);
  if (a && b) return `${a} – ${b}`;
  if (a) return `Desde ${a}`;
  if (b) return `Hasta ${b}`;
  return null;
}
