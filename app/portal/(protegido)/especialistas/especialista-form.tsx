"use client";

import Link from "next/link";
import { useActionState } from "react";

import { guardarEspecialista, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { urlPublica } from "@/lib/storage";

export type Especialista = {
  id: string;
  nombre: string;
  especialidad: string | null;
  anios: number | null;
  bio: string | null;
  foto_path: string | null;
  orden: number;
  publicado: boolean;
};

const input =
  "mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function EspecialistaForm({ inicial }: { inicial?: Especialista }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    guardarEspecialista,
    null
  );
  const fotoActual = urlPublica(inicial?.foto_path);

  return (
    <form action={action} className="max-w-xl space-y-5">
      {inicial?.id && <input type="hidden" name="id" value={inicial.id} />}

      <div>
        <label htmlFor="nombre" className="text-sm text-foreground/80">
          Nombre *
        </label>
        <input id="nombre" name="nombre" required defaultValue={inicial?.nombre} className={input} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="especialidad" className="text-sm text-foreground/80">
            Especialidad
          </label>
          <input
            id="especialidad"
            name="especialidad"
            defaultValue={inicial?.especialidad ?? ""}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="anios" className="text-sm text-foreground/80">
            Años de experiencia
          </label>
          <input
            id="anios"
            name="anios"
            type="number"
            min="0"
            defaultValue={inicial?.anios ?? ""}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="text-sm text-foreground/80">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={inicial?.bio ?? ""}
          className={input.replace("h-11", "min-h-24 py-2")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="orden" className="text-sm text-foreground/80">
            Orden
          </label>
          <input
            id="orden"
            name="orden"
            type="number"
            defaultValue={inicial?.orden ?? 0}
            className={input}
          />
        </div>
        <div className="flex items-end">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="publicado"
              defaultChecked={inicial?.publicado ?? false}
              className="size-4"
            />
            Publicado en el sitio
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="foto" className="text-sm text-foreground/80">
          Foto {inicial ? "(dejar vacío para conservar la actual)" : ""}
        </label>
        {fotoActual && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoActual}
            alt=""
            className="mt-2 h-20 w-20 rounded-md object-cover"
          />
        )}
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-2"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/portal/especialistas">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
