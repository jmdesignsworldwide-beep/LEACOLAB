/**
 * Núcleo de captura de comportamiento — LISTA BLANCA.
 *
 * Solo emite los campos codificados aquí. Nunca toca el contenido del DOM,
 * ni valores de formularios, ni imágenes: es imposible por construcción que
 * capture datos personales. Se carga de forma diferida (después de la primera
 * interacción) para no tocar el LCP, y envía por lotes con sendBeacon.
 *
 * Nunca se monta en /portal, previews ni desarrollo (lo decide el servidor).
 */

type Evento = {
  tipo: string;
  path: string;
  meta?: Record<string, string | number | boolean>;
};

const ENDPOINT = "/api/track";
const MAX_EVENTOS_SESION = 300; // límite de tasa por sesión (anti-inundación)
const LOTE_MS = 4000; // envío por lotes cada 4s
const SECCION_ATTR = "data-seccion"; // bloques marcados para tiempo-en-sección

let cola: Evento[] = [];
let enviados = 0;
let iniciado = false;
let pathActual = "";
let entradaPath = 0;

// Identificador de sesión ANÓNIMO: aleatorio, por pestaña, efímero. No se liga
// a ninguna identidad — solo permite agrupar eventos de una misma visita para
// el embudo y los recorridos. Se descarta al cerrar la pestaña.
function sesionId(): string {
  try {
    const k = "bl_sid";
    let v = sessionStorage.getItem(k);
    if (!v) {
      v = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      sessionStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

function dispositivo(): "m" | "e" {
  return window.innerWidth < 768 ? "m" : "e";
}

const SID = typeof window !== "undefined" ? sesionId() : "anon";
const DISP = typeof window !== "undefined" ? dispositivo() : "e";

// ── envío por lotes ─────────────────────────────────────────────────────────
function flush() {
  if (cola.length === 0) return;
  const lote = cola;
  cola = [];
  try {
    // sid y dispositivo van UNA vez por lote (no por evento) → menos peso.
    const blob = new Blob([JSON.stringify({ sid: SID, d: DISP, eventos: lote })], {
      type: "application/json",
    });
    // sendBeacon no bloquea la navegación al salir.
    navigator.sendBeacon?.(ENDPOINT, blob);
  } catch {
    /* si falla, se pierde el lote — nunca rompe la navegación */
  }
}

function encolar(tipo: string, meta?: Evento["meta"]) {
  if (enviados >= MAX_EVENTOS_SESION) return;
  enviados++;
  cola.push({ tipo, path: pathActual, meta });
  if (cola.length >= 20) flush();
}

// ── utilidades ──────────────────────────────────────────────────────────────
function seccionDe(el: Element | null): string {
  let n: Element | null = el;
  while (n) {
    const s = n.getAttribute?.(SECCION_ATTR);
    if (s) return s;
    n = n.parentElement;
  }
  return "";
}

// Tipo de elemento SIN texto ni identificadores: solo la naturaleza del nodo.
function claseDe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (el.closest("a")) return "enlace";
  if (el.closest("button")) return "boton";
  if (el.closest("input,textarea,select,label")) return "campo";
  if (tag === "img" || el.closest("figure")) return "imagen";
  return "otro";
}

function esClickeable(el: Element): boolean {
  return Boolean(
    el.closest("a,button,input,textarea,select,label,[role=button],[onclick]")
  );
}

// ── clics + frustración ─────────────────────────────────────────────────────
let ultimoClic = { x: 0, y: 0, t: 0, n: 0 };

function onClick(e: MouseEvent) {
  const el = e.target as Element | null;
  if (!el) return;

  // Coordenadas NORMALIZADAS (porcentaje del viewport), nunca píxeles crudos.
  const x = Math.round((e.clientX / window.innerWidth) * 1000) / 10;
  const y =
    Math.round(((e.clientY + window.scrollY) / document.body.scrollHeight) * 1000) /
    10;
  const seccion = seccionDe(el);
  const clase = claseDe(el);

  encolar("click", { x, y, seccion, clase });

  // Evento marcado explícitamente en el código (ej. CTA de agendar). El valor
  // lo controlamos nosotros con data-track → sin riesgo de capturar texto libre.
  const marca = (el.closest("[data-track]") as HTMLElement | null)?.dataset.track;
  if (marca) encolar("meta_evento", { nombre: marca.slice(0, 24) });

  // Clic muerto: clic en algo que no es clickeable.
  if (!esClickeable(el)) {
    encolar("frustracion", { tipo: "muerto", seccion, clase });
  }

  // Clic de rabia: 3+ clics muy juntos en el mismo punto.
  const ahora = Date.now();
  const cerca =
    Math.abs(e.clientX - ultimoClic.x) < 30 &&
    Math.abs(e.clientY - ultimoClic.y) < 30 &&
    ahora - ultimoClic.t < 800;
  ultimoClic = {
    x: e.clientX,
    y: e.clientY,
    t: ahora,
    n: cerca ? ultimoClic.n + 1 : 1,
  };
  if (ultimoClic.n === 3) {
    encolar("frustracion", { tipo: "rabia", seccion });
  }
}

// ── scroll: profundidad + errático ──────────────────────────────────────────
let maxDepth = 0;
const hitos = new Set<number>();
let scrollDirs: number[] = [];
let ultScrollY = 0;
let ultScrollT = 0;

function onScroll() {
  const alto = document.body.scrollHeight - window.innerHeight;
  const depth = alto > 0 ? Math.min(100, ((window.scrollY / alto) * 100) | 0) : 100;
  if (depth > maxDepth) maxDepth = depth;

  for (const h of [25, 50, 75, 100]) {
    if (depth >= h && !hitos.has(h)) {
      hitos.add(h);
      encolar("scroll", { depth: h });
    }
  }

  // Scroll errático: muchos cambios de dirección en poco tiempo.
  const ahora = Date.now();
  const dir = Math.sign(window.scrollY - ultScrollY);
  if (dir !== 0 && ahora - ultScrollT < 1200) {
    scrollDirs.push(dir);
    if (scrollDirs.length > 6) scrollDirs.shift();
    let cambios = 0;
    for (let i = 1; i < scrollDirs.length; i++)
      if (scrollDirs[i] !== scrollDirs[i - 1]) cambios++;
    if (cambios >= 4) {
      encolar("frustracion", { tipo: "erratico", seccion: "" });
      scrollDirs = [];
    }
  } else if (ahora - ultScrollT >= 1200) {
    scrollDirs = [dir];
  }
  ultScrollY = window.scrollY;
  ultScrollT = ahora;
}

// ── tiempo por sección ──────────────────────────────────────────────────────
const tiempos = new Map<string, number>();
const visibles = new Map<string, number>();
let io: IntersectionObserver | null = null;

function observarSecciones() {
  io?.disconnect();
  io = new IntersectionObserver(
    (entries) => {
      const ahora = Date.now();
      for (const en of entries) {
        const s = (en.target as HTMLElement).getAttribute(SECCION_ATTR) || "";
        if (!s) continue;
        if (en.isIntersecting) {
          visibles.set(s, ahora);
        } else if (visibles.has(s)) {
          const dt = ahora - (visibles.get(s) || ahora);
          tiempos.set(s, (tiempos.get(s) || 0) + dt);
          visibles.delete(s);
        }
      }
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(`[${SECCION_ATTR}]`).forEach((el) => io!.observe(el));
}

function volcarTiempos() {
  const ahora = Date.now();
  for (const [s, t0] of visibles) {
    tiempos.set(s, (tiempos.get(s) || 0) + (ahora - t0));
  }
  visibles.clear();
  for (const [s, ms] of tiempos) {
    if (ms > 800) encolar("tiempo_seccion", { seccion: s, ms: ms | 0 });
  }
  tiempos.clear();
}

// ── navegación / entrada-salida ─────────────────────────────────────────────
function registrarVista() {
  pathActual = location.pathname;
  entradaPath = Date.now();
  maxDepth = 0;
  hitos.clear();
  encolar("pageview", { ref: document.referrer ? "externo" : "interno" });
  observarSecciones();
}

function registrarSalida() {
  volcarTiempos();
  const dur = Date.now() - entradaPath;
  encolar("salida", { depth: maxDepth, ms: dur | 0 });
  // Retroceso rápido: se fue de la página en < 3s.
  if (dur < 3000) encolar("frustracion", { tipo: "retroceso", depthv: maxDepth });
  flush();
}

// ── arranque ────────────────────────────────────────────────────────────────
export function start() {
  if (iniciado) return;
  iniciado = true;

  // Puente mínimo para marcar conversiones desde el código (éxito de formulario,
  // fin del diagnóstico). Solo nombres controlados por nosotros; sin PII.
  (window as unknown as { __blTrack?: (n: string) => void }).__blTrack = (n) =>
    encolar("meta_evento", { nombre: String(n).slice(0, 24) });

  registrarVista();

  addEventListener("click", onClick, { passive: true, capture: true });
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") registrarSalida();
  });
  addEventListener("pagehide", registrarSalida);
  setInterval(flush, LOTE_MS);

  // SPA: detectar cambios de ruta (App Router muta history).
  let ultimo = location.pathname;
  const chequear = () => {
    if (location.pathname !== ultimo) {
      registrarSalida();
      ultimo = location.pathname;
      registrarVista();
    }
  };
  const push = history.pushState;
  history.pushState = function (...a) {
    push.apply(this, a as Parameters<typeof history.pushState>);
    chequear();
  };
  addEventListener("popstate", chequear);
}
