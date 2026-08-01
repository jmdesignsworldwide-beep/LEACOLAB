"use client";

import { whatsappUrl } from "@/lib/site";

/**
 * Aviso de fallo de envío del lado del servidor. Mensaje humano (nunca detalle
 * técnico), con la alternativa de WhatsApp para que nadie se quede sin
 * contactar, y un código de referencia opaco si vino del servidor.
 */
export function FormErrorAviso({
  mensaje,
  refCodigo,
}: {
  mensaje: string;
  refCodigo?: string | null;
}) {
  return (
    <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">{mensaje}</p>
      <p className="mt-2 text-sm text-red-800/90">
        Puedes reintentar, o escribirnos directo por{" "}
        <a
          href={whatsappUrl("Hola, tuve un problema al enviar el formulario en la web.")}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          WhatsApp
        </a>
        .
      </p>
      {refCodigo && (
        <p className="mt-2 text-xs text-red-800/70">Referencia: {refCodigo}</p>
      )}
    </div>
  );
}
