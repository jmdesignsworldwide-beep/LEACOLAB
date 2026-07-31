"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { iniciarSesion, type LoginState } from "./actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const params = useSearchParams();
  const errorInicial: LoginState =
    params.get("error") === "no-autorizado"
      ? { error: "Tu cuenta no tiene acceso al portal." }
      : null;

  const [state, formAction, pending] = useActionState(
    iniciarSesion,
    errorInicial
  );

  return (
    <main className="flex min-h-svh items-center justify-center bg-bl-marble px-5">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-8" />
          <h1 className="mt-4 text-fluid-lg">Portal Beauty by Leela</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acceso privado del equipo
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm text-foreground/80">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-foreground/80">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
