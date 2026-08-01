"use client";

import { useState, useTransition } from "react";

import { CONSENT_CONTACTO } from "@/lib/consent";
import { Button } from "@/components/ui/button";
import { enviarMensaje } from "@/app/(sitio)/contacto/actions";

export function ContactoForm() {
  const [pending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await enviarMensaje({
        nombre,
        contacto,
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
        <p className="text-fluid-base">¡Mensaje enviado!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te responderemos lo antes posible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border p-6 md:p-8">
      <h2 className="text-fluid-lg">Escríbenos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        ¿Tienes una duda? Déjanos tu mensaje y te contactamos.
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
        <div>
          <label htmlFor="c-nombre" className="text-sm">
            Nombre
          </label>
          <input
            id="c-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="c-contacto" className="text-sm">
            WhatsApp o correo
          </label>
          <input
            id="c-contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="c-msg" className="text-sm">
            Mensaje
          </label>
          <textarea
            id="c-msg"
            rows={4}
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
          <span>{CONSENT_CONTACTO.texto}</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
}
