import type { Metadata } from "next";
import { MapPin, Clock, MessageCircle, Mail, Instagram } from "lucide-react";

import {
  getContenido,
  type ContactoInfo,
  type AgendarAviso,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { AgendarAvisoBloque } from "@/components/agendar-aviso";
import { ContactoForm } from "@/components/contacto/contacto-form";

export const revalidate = 300;
export const metadata: Metadata = { title: "Contacto" };

export default async function ContactoPage() {
  const [info, aviso] = await Promise.all([
    getContenido<ContactoInfo>("contacto_info"),
    getContenido<AgendarAviso>("agendar_aviso"),
  ]);

  const whatsapp = info?.whatsapp ?? siteConfig.contact.whatsapp;
  const correo = info?.correo ?? siteConfig.contact.email;
  const waLink = `https://wa.me/1${whatsapp.replace(/\D/g, "")}`;

  return (
    <div className="pb-24">
      <section className="container pt-28 text-center md:pt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {info?.kicker ?? "Contacto"}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-fluid-3xl">
          {info?.titulo ?? "Hablemos de tu piel"}
        </h1>
        <div className="bl-rule mx-auto mt-6 w-12 opacity-70" />
        {info?.intro && (
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {info.intro}
          </p>
        )}
      </section>

      <section className="container mt-14 grid gap-10 md:grid-cols-2">
        {/* Columna: agendar + datos */}
        <div className="space-y-8">
          {/* Agendar */}
          <div className="rounded-lg border border-border bg-bl-marble/60 p-6 md:p-8 text-center">
            <h2 className="text-fluid-lg">Agenda tu evaluación</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Reserva en línea en segundos. Tu primera cita es una evaluación con
              Marianny.
            </p>
            <div className="mt-5">
              <Button asChild size="lg">
                <a href={siteConfig.setmoreUrl} target="_blank" rel="noreferrer">
                  Agendar por Setmore
                </a>
              </Button>
            </div>
          </div>

          {/* Datos de contacto */}
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-bl-gold-deep" aria-hidden />
              <span>
                <span className="block text-foreground">WhatsApp</span>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground underline-offset-4 hover:underline"
                >
                  {siteConfig.contact.phone}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-bl-gold-deep" aria-hidden />
              <span>
                <span className="block text-foreground">Correo</span>
                <a
                  href={`mailto:${correo}`}
                  className="text-muted-foreground underline-offset-4 hover:underline"
                >
                  {correo}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Instagram className="mt-0.5 size-5 shrink-0 text-bl-gold-deep" aria-hidden />
              <span>
                <span className="block text-foreground">Instagram</span>
                <a
                  href={siteConfig.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground underline-offset-4 hover:underline"
                >
                  {siteConfig.contact.instagram}
                </a>
              </span>
            </li>
            {info?.direccion && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-bl-gold-deep" aria-hidden />
                <span>
                  <span className="block text-foreground">Ubicación</span>
                  <span className="text-muted-foreground">{info.direccion}</span>
                </span>
              </li>
            )}
            {info?.horario && info.horario.length > 0 && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-bl-gold-deep" aria-hidden />
                <span>
                  <span className="block text-foreground">Horario</span>
                  <span className="text-muted-foreground">
                    {info.horario.map((h, i) => (
                      <span key={i} className="block">
                        {h}
                      </span>
                    ))}
                  </span>
                </span>
              </li>
            )}
          </ul>

          {info?.nota && (
            <p className="text-sm italic text-muted-foreground">{info.nota}</p>
          )}
        </div>

        {/* Columna: formulario */}
        <div>
          <ContactoForm />
        </div>
      </section>

      {/* Cómo es la primera cita */}
      <section className="container mt-16">
        <div className="mx-auto max-w-2xl">
          <AgendarAvisoBloque aviso={aviso} />
        </div>
      </section>
    </div>
  );
}
