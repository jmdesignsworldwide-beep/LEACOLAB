import { createPublicClient } from "@/lib/supabase/public";

export type Resena = {
  id: string;
  autor: string;
  texto: string;
  tipo: "paciente" | "alumna";
  rating: number | null;
  fuente: string | null;
};

export async function getResenas(): Promise<Resena[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("resenas")
    .select("id, autor, texto, tipo, rating, fuente")
    .eq("publicado", true)
    .is("deleted_at", null)
    .order("destacada", { ascending: false })
    .order("orden", { ascending: true });
  if (error) throw new Error("No se pudieron cargar las reseñas");
  return (data ?? []) as Resena[];
}
