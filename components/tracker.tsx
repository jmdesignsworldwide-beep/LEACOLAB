"use client";

import { useEffect } from "react";

/**
 * Carga el núcleo de captura de forma DIFERIDA: solo tras la primera
 * interacción (o en el primer idle), para no tocar el LCP ni el First Load JS.
 * El servidor decide si montar este componente (solo en producción, nunca en
 * /portal ni previews), así que aquí no hay condiciones de entorno.
 */
export function Tracker() {
  useEffect(() => {
    let hecho = false;
    const arrancar = () => {
      if (hecho) return;
      hecho = true;
      limpiar();
      import("@/lib/track/core")
        .then((m) => m.start())
        .catch(() => {});
    };
    const limpiar = () => {
      eventos.forEach((e) => removeEventListener(e, arrancar));
    };
    const eventos = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    eventos.forEach((e) =>
      addEventListener(e, arrancar, { once: true, passive: true })
    );
    // Respaldo: si nadie interactúa, arranca en el primer momento ocioso.
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback;
    const t = idle ? idle(arrancar) : window.setTimeout(arrancar, 4000);

    return () => {
      limpiar();
      if (!idle) clearTimeout(t as number);
    };
  }, []);

  return null;
}
