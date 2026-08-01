"use client";

import { useState, useTransition } from "react";

import { CONSENT_INSCRIPCION } from "@/lib/consent";
import { Button } from "@/components/ui/button";
import { enviarInscripcion } from "@/app/(sitio)/formacion/actions";

export function InscripcionForm({
  programas,
  programaInicial,
}: {
  programas: { id: string; nombre: string }[];
  programaInicial?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programaId, setProgramaId] = useState(programaInicial ?? programas[0]?.id ?? "");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await enviarInscripcion({
        programaId,
        nombre,
        whatsapp,
        correo,
        mensaje,
        consentimiento: consent,
        sitio_web: honey,
      });
      if (res.ok) setEnviado(true);
      else setError(res.error);
    });
  }

  if (enviado) {
    return (
      <div className="rounded-lg border border-border bg-background p-6 text-center">
        <p className="text-fluid-base">¡Gracias por tu interés!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te contactaremos con los detalles del programa muy pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border p-6 md:p-8">
      <h2 className="text-fluid-lg">Solicita información</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Déjanos tus datos y te contamos cupos, fechas e inversión.
      </p>

      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-5 space-y-4">
        {programas.length > 0 && (
          <div>
            <label htmlFor="f-prog" className="text-sm">
              Programa de interés
            </label>
            <select
              id="f-prog"
              value={programaId}
              onChange={(e) => setProgramaId(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {programas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="f-nombre" className="text-sm">
            Nombre
          </label>
          <input
            id="f-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="f-ws" className="text-sm">
              WhatsApp
            </label>
            <input
              id="f-ws"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              autoComplete="tel"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="f-correo" className="text-sm">
              Correo
            </label>
            <input
              id="f-correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div>
          <label htmlFor="f-msg" className="text-sm">
            Mensaje <span className="text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            id="f-msg"
            rows={3}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-bl-charcoal"
          />
          <span>{CONSENT_INSCRIPCION.texto}</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </div>
    </form>
  );
}
