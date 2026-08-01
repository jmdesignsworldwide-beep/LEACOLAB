import { EspecialistaForm } from "../especialista-form";

export const dynamic = "force-dynamic";

export default function NuevaEspecialista() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Especialistas
      </p>
      <h1 className="mt-2 mb-8 text-fluid-2xl">Nueva especialista</h1>
      <EspecialistaForm />
    </div>
  );
}
