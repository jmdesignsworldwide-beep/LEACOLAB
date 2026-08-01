import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { EspecialistaForm } from "../especialista-form";

export const dynamic = "force-dynamic";

export default async function EditarEspecialista({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("especialistas")
    .select("id, nombre, especialidad, anios, bio, foto_path, orden, publicado")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Especialistas
      </p>
      <h1 className="mt-2 mb-8 text-fluid-2xl">Editar especialista</h1>
      <EspecialistaForm inicial={data} />
    </div>
  );
}
