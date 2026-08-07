import { createPublicClient } from "@/lib/supabase/public";
import { formatoRD } from "@/lib/format";

export type Servicio = {
  id: string;
  categoria: string;
  categoria_orden: number;
  nombre: string;
  duracion_texto: string | null;
  precio: number | null;
  precio_texto: string | null;
  detalle: string | null;
};

export type CategoriaServicios = {
  categoria: string;
  servicios: Servicio[];
};

/** Texto de precio: usa el override si existe, si no formatea el RD$. */
export function precioServicio(s: Servicio): string | null {
  if (s.precio_texto) return s.precio_texto;
  return formatoRD(s.precio);
}

/** Servicios publicados, agrupados por categoría en su orden. */
export async function getServicios(): Promise<CategoriaServicios[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("servicios")
    .select(
      "id, categoria, categoria_orden, nombre, duracion_texto, precio, precio_texto, detalle, orden"
    )
    .eq("publicado", true)
    .is("deleted_at", null)
    .order("categoria_orden", { ascending: true })
    .order("orden", { ascending: true });
  // /servicios es una página ISR prerenderizada: un throw aquí rompe el build
  // (error.tsx no captura errores de prerender). Ante cualquier fallo de carga
  // —incluida la tabla aún sin crear— degradamos al estado vacío.
  if (error) return [];

  const grupos: CategoriaServicios[] = [];
  for (const s of (data ?? []) as Servicio[]) {
    let g = grupos.find((x) => x.categoria === s.categoria);
    if (!g) {
      g = { categoria: s.categoria, servicios: [] };
      grupos.push(g);
    }
    g.servicios.push(s);
  }
  return grupos;
}
