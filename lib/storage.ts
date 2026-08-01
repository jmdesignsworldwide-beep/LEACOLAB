/** URL pública de un archivo del bucket `publico`. */
export function urlPublica(path?: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/publico/${path}` : null;
}
