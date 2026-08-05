"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  PREGUNTAS,
  perfilTexto,
  focoRecomendado,
  type RespuestasQuiz,
} from "@/lib/diagnostico";
import type { DiagnosticoContenido } from "@/lib/content";
import { CONSENT_LEAD } from "@/lib/consent";
import { siteConfig } from "@/lib/site";
import {
  valNombre,
  valWhatsapp,
  valCorreo,
  valAlMenosContacto,
  valConsentimiento,
} from "@/lib/validacion";
import { marcarEvento } from "@/lib/track/marca";
import { Button } from "@/components/ui/button";
import { Campo } from "@/components/ui/campo";
import { FormErrorAviso } from "@/components/form-error-aviso";
import { registrarDiagnostico, enviarLead } from "@/app/(sitio)/diagnostico/actions";

type Fase = "intro" | "quiz" | "resultado";

export function DiagnosticoQuiz({ intro }: { intro: DiagnosticoContenido | null }) {
  const reduce = useReducedMotion();
  const [fase, setFase] = useState<Fase>("intro");
  const [qi, setQi] = useState(0);
  const [resp, setResp] = useState<Partial<RespuestasQuiz>>({});

  const total = PREGUNTAS.length;
  const dx = reduce ? 0 : 24;

  function responder(id: keyof RespuestasQuiz, valor: string) {
    setResp((r) => ({ ...r, [id]: valor }));
    if (qi < total - 1) setQi(qi + 1);
    else setFase("resultado");
  }

  function atras() {
    if (qi > 0) setQi(qi - 1);
    else setFase("intro");
  }

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <AnimatePresence mode="wait">
        {fase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: dx }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -dx }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              {intro?.intro ??
                "Responde seis preguntas rápidas y te decimos por dónde empezar. Sin compromiso: tus datos solo se guardan si pides que te contactemos."}
            </p>
            <div className="mt-8">
              <Button size="lg" onClick={() => setFase("quiz")}>
                {intro?.cta_texto ?? "Comenzar mi diagnóstico"}
              </Button>
            </div>
          </motion.div>
        )}

        {fase === "quiz" && (
          <motion.div
            key={`q-${qi}`}
            initial={{ opacity: 0, x: dx }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dx }}
            transition={{ duration: 0.35 }}
          >
            {/* Progreso */}
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>
                Pregunta {qi + 1} de {total}
              </span>
              <button
                type="button"
                onClick={atras}
                className="rounded px-1 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Atrás
              </button>
            </div>
            <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-bl-gold transition-all duration-500"
                style={{ width: `${((qi + 1) / total) * 100}%` }}
              />
            </div>

            <fieldset className="mt-8">
              <legend className="text-fluid-lg">{PREGUNTAS[qi].titulo}</legend>
              <div className="mt-6 space-y-3">
                {PREGUNTAS[qi].opciones.map((o) => {
                  const activo = resp[PREGUNTAS[qi].id] === o.valor;
                  return (
                    <label
                      key={o.valor}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-sm transition-colors ${
                        activo
                          ? "border-bl-charcoal bg-bl-charcoal/[0.03]"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name={PREGUNTAS[qi].id}
                        value={o.valor}
                        checked={activo}
                        onChange={() => responder(PREGUNTAS[qi].id, o.valor)}
                        className="size-4 accent-bl-charcoal"
                      />
                      <span>{o.etiqueta}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </motion.div>
        )}

        {fase === "resultado" && (
          <Resultado key="resultado" resp={resp as RespuestasQuiz} reduce={!!reduce} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Resultado({
  resp,
  reduce,
}: {
  resp: RespuestasQuiz;
  reduce: boolean;
}) {
  useEffect(() => {
    // Registro anónimo (inteligencia agregada, sin datos personales).
    registrarDiagnostico(resp);
    marcarEvento("diagnostico-fin"); // paso del embudo: terminó el diagnóstico
  }, [resp]);

  const foco = focoRecomendado(resp);
  const quiereFormacion = resp.busca_formacion === "si";

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-lg border border-border bg-bl-marble/50 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-bl-charcoal/70">
          Tu resultado
        </p>
        <p className="mt-4 text-fluid-lg leading-snug">{perfilTexto(resp)}</p>
        <div className="bl-rule mt-5 w-10 opacity-70" />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Te recomendamos empezar por una evaluación con Marianny, donde se
          define tu plan exacto. El foco de tu proceso sería{" "}
          <span className="font-medium text-bl-charcoal">{foco.toLowerCase()}</span>.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer" data-track="agendar">
              Agendar mi evaluación
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/protocolos">Ver los protocolos</Link>
          </Button>
        </div>

        {quiereFormacion && (
          <p className="mt-5 text-sm">
            <Link
              href="/formacion"
              className="font-medium text-bl-charcoal underline-offset-4 hover:underline"
            >
              También te interesa la formación → conócela aquí
            </Link>
          </p>
        )}
      </div>

      <ContactoLead resp={resp} />
    </motion.div>
  );
}

function ContactoLead({ resp }: { resp: RespuestasQuiz }) {
  const [pending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const [fallo, setFallo] = useState<{ error: string; ref?: string | null } | null>(null);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
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
      const res = await enviarLead({
        respuestas: resp,
        nombre,
        whatsapp,
        correo,
        consentimiento: consent,
        sitio_web: honey,
      });
      if (res.ok) {
        setEnviado(true);
        marcarEvento("contacto-enviado"); // paso del embudo: dejó contacto
      } else setFallo({ error: res.error, ref: res.ref });
    });
  }

  if (enviado) {
    return (
      <div className="mt-8 rounded-lg border border-border bg-bl-marble/60 p-6 text-center md:p-8">
        <p className="text-fluid-lg">¡Listo, recibimos tus datos!</p>
        <div className="bl-rule mx-auto mt-4 w-10 opacity-70" />
        <p className="mt-4 text-sm text-muted-foreground">
          Marianny revisa personalmente cada diagnóstico y te escribimos en menos
          de 24 horas con tus próximos pasos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 rounded-lg border border-border p-6 md:p-8">
      <h2 className="text-fluid-base font-medium">Recibe tu plan por WhatsApp</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Opcional. Déjanos tus datos y te acompañamos con los próximos pasos.
      </p>

      {/* Honeypot anti-bot: oculto visualmente y para lectores de pantalla */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
        </label>
      </div>

      <div className="mt-5 space-y-4">
        <Campo
          id="d-nombre"
          label="Nombre"
          value={nombre}
          onChange={setNombre}
          onBlur={() => setErrs((s) => ({ ...s, nombre: valNombre(nombre) }))}
          error={errs.nombre}
          autoComplete="name"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            id="d-ws"
            label="WhatsApp"
            value={whatsapp}
            onChange={setWhatsapp}
            onBlur={() => setErrs((s) => ({ ...s, whatsapp: valWhatsapp(whatsapp), contacto: valAlMenosContacto(whatsapp, correo) }))}
            error={errs.whatsapp}
            inputMode="tel"
            autoComplete="tel"
          />
          <Campo
            id="d-correo"
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
            <span>{CONSENT_LEAD.texto}</span>
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
          {pending ? "Enviando…" : "Quiero que me contacten"}
        </Button>
      </div>
    </form>
  );
}
