import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { urlPublica } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { eliminarEspecialista } from "./actions";

export const dynamic = "force-dynamic";

export default async function EspecialistasPage() {
  const supabase = await createClient();
  const { data: lista } = await supabase
    .from("especialistas")
    .select("id, nombre, especialidad, anios, foto_path, publicado, orden")
    .is("deleted_at", null)
    .order("orden", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Contenido
          </p>
          <h1 className="mt-2 text-fluid-2xl">Especialistas</h1>
        </div>
        <Button asChild>
          <Link href="/portal/especialistas/nuevo">Nueva</Link>
        </Button>
      </div>

      {!lista || lista.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-background p-10 text-center">
          <div className="mx-auto h-0.5 w-10 rounded-full bg-bl-gold" />
          <p className="mt-5 text-fluid-base">Aún no hay especialistas</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Agrega a tu equipo con foto, especialidad y años. Aparecerán en la
            sección Nosotras del sitio.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-lg border border-border bg-background">
          {lista.map((e) => {
            const foto = urlPublica(e.foto_path);
            return (
              <li key={e.id} className="flex items-center gap-4 p-4">
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.nombre}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {[e.especialidad, e.anios ? `${e.anios} años` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                {!e.publicado && (
                  <span className="rounded-full bg-muted px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    Borrador
                  </span>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/portal/especialistas/${e.id}`}>Editar</Link>
                </Button>
                <form action={eliminarEspecialista}>
                  <input type="hidden" name="id" value={e.id} />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 cursor-pointer items-center rounded-md px-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Eliminar
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
