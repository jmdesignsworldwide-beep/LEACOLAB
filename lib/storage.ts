/** URL pública de un archivo del bucket `publico`. */
export function urlPublica(path?: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base
    ? `${base}/storage/v1/object/public/publico/${path}`
    : null;
}

/** Nombre de archivo seguro y único dentro de una carpeta del bucket. */
export function rutaSubida(carpeta: string, nombreOriginal: string): string {
  const ext = nombreOriginal.includes(".")
    ? nombreOriginal.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "bin";
  const base = nombreOriginal
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${carpeta}/${Date.now()}-${rand}-${base || "img"}.${ext}`;
}
