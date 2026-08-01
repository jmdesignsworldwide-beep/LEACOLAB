"use client";

import { useState, useTransition } from "react";

import { CONSENT_INSCRIPCION } from "@/lib/consent";
import {
  valNombre,
  valWhatsapp,
  valCorreo,
  valAlMenosContacto,
  valConsentimiento,
} from "@/lib/validacion";
import { Button } from "@/components/ui/button";
import { Campo, CampoArea } from "@/components/ui/campo";
import { FormErrorAviso } from "@/components/form-error-aviso";
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
  const [fallo, setFallo] = useState<{ error: string; ref?: string | null } | null>(null);
  const [programaId, setProgramaId] = useState(programaInicial ?? programas[0]?.id ?? "");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [errs, setErrs] = useState<Record<string, string | null>>({});

  function validarTodo() {
    const e: Record<string, string | null> = {
      nombre: valNombre(nombre),
      whatsapp: valWhatsapp(whatsapp),
      correo: valCorreo(correo),
      contacto: valAlMenosContacto(whatsapp, correo),
      consent: valConsentimiento(consent),
    };
    setErrs(e);
    return !Object.values(e).some(Boolean);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFallo(null);
    if (!validarTodo()) return;
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
      else setFallo({ error: res.error, ref: res.ref });
    });
  }

  if (enviado) {
    return (
      <div className="rounded-lg border border-border bg-bl-marble/60 p-6 text-center md:p-8">
        <p className="text-fluid-lg">¡Gracias por tu interés!</p>
        <div className="bl-rule mx-auto mt-4 w-10 opacity-70" />
        <p className="mt-4 text-sm text-muted-foreground">
          Te contactaremos con los cupos, fechas e inversión del programa en menos
          de 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-lg border border-border p-6 md:p-8">
      <h2 className="text-fluid-lg">Solicita información</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Déjanos tus datos y te contamos cupos, fechas e inversión.
      </p>

      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
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
        <Campo
          id="f-nombre"
          label="Nombre"
          value={nombre}
          onChange={setNombre}
          onBlur={() => setErrs((s) => ({ ...s, nombre: valNombre(nombre) }))}
          error={errs.nombre}
          autoComplete="name"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            id="f-ws"
            label="WhatsApp"
            value={whatsapp}
            onChange={setWhatsapp}
            onBlur={() => setErrs((s) => ({ ...s, whatsapp: valWhatsapp(whatsapp), contacto: valAlMenosContacto(whatsapp, correo) }))}
            error={errs.whatsapp}
            inputMode="tel"
            autoComplete="tel"
          />
          <Campo
            id="f-correo"
            label="Correo"
            value={correo}
            onChange={setCorreo}
            onBlur={() => setErrs((s) => ({ ...s, correo: valCorreo(correo), contacto: valAlMenosContacto(whatsapp, correo) }))}
            error={errs.correo}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        </div>
        {errs.contacto && !errs.whatsapp && !errs.correo && (
          <p role="alert" className="text-xs text-red-700">
            {errs.contacto}
          </p>
        )}
        <CampoArea
          id="f-msg"
          label="Mensaje"
          opcional
          rows={3}
          value={mensaje}
          onChange={setMensaje}
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
            <span>{CONSENT_INSCRIPCION.texto}</span>
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
          {pending ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </div>
    </form>
  );
}
