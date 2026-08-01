import Link from "next/link";

import { requirePortalUser } from "@/lib/portal";
import { Logo } from "@/components/logo";
import { cerrarSesion } from "./actions";

// El portal es privado y depende de la sesión: nunca se prerenderiza.
export const dynamic = "force-dynamic";

// Módulos del portal (se activan en las fases 3b/3c).
const modulos = [
  { label: "Panel", href: "/portal", activo: true },
  { label: "Contenido", href: "/portal", activo: false },
  { label: "Casos", href: "/portal", activo: false },
  { label: "Protocolos", href: "/portal", activo: false },
  { label: "Formación", href: "/portal", activo: false },
  { label: "Leads", href: "/portal", activo: false },
  { label: "Inteligencia", href: "/portal", activo: false },
];

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const usuario = await requirePortalUser();

  return (
    <div className="min-h-svh bg-bl-marble md:grid md:grid-cols-[240px_1fr]">
      {/* Barra lateral */}
      <aside className="hidden border-r border-border bg-background md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <Logo className="h-6" />
          <span className="font-display text-lg">Portal</span>
        </div>
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {modulos.map((m) => (
              <li key={m.label}>
                {m.activo ? (
                  <Link
                    href={m.href}
                    className="flex min-h-11 items-center rounded-md px-3 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {m.label}
                  </Link>
                ) : (
                  <span className="flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground/60">
                    {m.label}
                    <span className="ml-auto text-[10px] uppercase tracking-wide">
                      pronto
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-5 py-4">
          <div className="flex items-center gap-2 md:hidden">
            <Logo className="h-6" />
            <span className="font-display">Portal</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{usuario.nombre}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {usuario.rol === "admin" ? "Administradora" : "Editora"}
              </p>
            </div>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border px-3 text-sm transition-colors hover:bg-muted"
              >
                Salir
              </button>
            </form>
          </div>
        </header>

        <div className="flex-1 p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
