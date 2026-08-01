"use client";

import { useState, useTransition } from "react";

import { CONSENT_CONTACTO } from "@/lib/consent";
import { valNombre, valContactoLibre, valMensaje, valConsentimiento } from "@/lib/validacion";
import { Button } from "@/components/ui/button";
import { Campo, CampoArea } from "@/components/ui/campo";
import { FormErrorAviso } from "@/components/form-error-aviso";
import { enviarMensaje } from "@/app/(sitio)/contacto/actions";

export function ContactoForm() {
  const [pending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const [fallo, setFallo] = useState<{ error: string; ref?: string | null } | null>(null);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [errs, setErrs] = useState<{ nombre?: string | null; contacto?: string | null; mensaje?: string | null; consent?: string | null }>({});

  function validarTodo() {
    const e = {
      nombre: valNombre(nombre),
      contacto: valContactoLibre(contacto),
      mensaje: valMensaje(mensaje),
      consent: valConsentimiento(consent),
    };
    setErrs(e);
    return !e.nombre && !e.contacto && !e.mensaje && !e.consent;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFallo(null);
    if (!validarTodo()) return;
    startTransition(async () => {
      const res = await enviarMensaje({
        nombre,
        contacto,
        mensaje,
        consentimiento: consent,
        sitio_web: honey,
      });
      if (res.ok) setEnviado(true);
      else setFallo({ error: res.error, ref: res.ref });
    });
  }

  if (enviado) {
    return (
      <div className="rounded-lg border border-border bg-bl-marble/60 p-6 text-center md:p-8">
        <p className="text-fluid-lg">¡Recibimos tu mensaje!</p>
        <div className="bl-rule mx-auto mt-4 w-10 opacity-70" />
        <p className="mt-4 text-sm text-muted-foreground">
          Te escribimos en menos de 24 horas. Si es urgente, puedes escribirnos
          directo por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-lg border border-border p-6 md:p-8">
      <h2 className="text-fluid-lg">Escríbenos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        ¿Tienes una duda? Déjanos tu mensaje y te contactamos.
      </p>

      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
        </label>
      </div>

      <div className="mt-5 space-y-4">
        <Campo
          id="c-nombre"
          label="Nombre"
          value={nombre}
          onChange={setNombre}
          onBlur={() => setErrs((s) => ({ ...s, nombre: valNombre(nombre) }))}
          error={errs.nombre}
          autoComplete="name"
        />
        <Campo
          id="c-contacto"
          label="WhatsApp o correo"
          value={contacto}
          onChange={setContacto}
          onBlur={() => setErrs((s) => ({ ...s, contacto: valContactoLibre(contacto) }))}
          error={errs.contacto}
        />
        <CampoArea
          id="c-msg"
          label="Mensaje"
          value={mensaje}
          onChange={setMensaje}
          onBlur={() => setErrs((s) => ({ ...s, mensaje: valMensaje(mensaje) }))}
          error={errs.mensaje}
        />

        <div>
          <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrs((s) => ({ ...s, consent: valConsentimiento(e.target.checked) }));
              }}
              className="mt-0.5 size-4 shrink-0 accent-bl-charcoal"
            />
            <span>{CONSENT_CONTACTO.texto}</span>
          </label>
          {errs.consent && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {errs.consent}
            </p>
          )}
        </div>
      </div>

      {fallo && <FormErrorAviso mensaje={fallo.error} refCodigo={fallo.ref} />}

      <div className="mt-6">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
}
