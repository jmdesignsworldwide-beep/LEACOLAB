"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const input =
  "mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function CuentaPage() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [estado, setEstado] = useState<
    { tipo: "ok" | "error"; texto: string } | null
  >(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado(null);
    if (pw.length < 8) {
      setEstado({ tipo: "error", texto: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }
    if (pw !== pw2) {
      setEstado({ tipo: "error", texto: "Las contraseñas no coinciden." });
      return;
    }
    setCargando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setCargando(false);
    if (error) {
      setEstado({ tipo: "error", texto: "No se pudo actualizar: " + error.message });
      return;
    }
    setPw("");
    setPw2("");
    setEstado({ tipo: "ok", texto: "Contraseña actualizada." });
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Cuenta
      </p>
      <h1 className="mt-2 text-fluid-2xl">Cambiar contraseña</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cambia la contraseña que se te asignó al crear tu cuenta.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="pw" className="text-sm text-foreground/80">
            Nueva contraseña
          </label>
          <input
            id="pw"
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="pw2" className="text-sm text-foreground/80">
            Repetir contraseña
          </label>
          <input
            id="pw2"
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className={input}
          />
        </div>

        {estado && (
          <p
            role="alert"
            className={
              estado.tipo === "ok"
                ? "text-sm text-foreground"
                : "text-sm text-destructive"
            }
          >
            {estado.texto}
          </p>
        )}

        <Button type="submit" disabled={cargando}>
          {cargando ? "Guardando…" : "Actualizar contraseña"}
        </Button>
      </form>
    </div>
  );
}
