import { createPublicClient } from "@/lib/supabase/public";

export type Programa = {
  id: string;
  slug: string;
  nombre: string;
  tipo: "curso" | "mentoria" | "clase_privada";
  para_quien: string | null;
  requisitos: string | null;
  modalidad: "presencial" | "virtual" | "hibrida" | null;
  duracion_texto: string | null;
  cupo: number | null;
  temario: string[];
  inversion: number | null;
  imagen_path: string | null;
};

export const TIPO_LABEL: Record<Programa["tipo"], string> = {
  curso: "Curso",
  mentoria: "Mentoría",
  clase_privada: "Clase privada",
};

export const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
};

export async function getProgramas(): Promise<Programa[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("programas_formacion")
    .select(
      "id, slug, nombre, tipo, para_quien, requisitos, modalidad, duracion_texto, cupo, temario, inversion, imagen_path"
    )
    .eq("activo", true)
    .is("deleted_at", null)
    .order("orden", { ascending: true });
  if (error) throw new Error("No se pudo cargar la formación");
  return (data ?? []).map((p) => ({
    ...p,
    temario: p.temario ?? [],
  })) as Programa[];
}
