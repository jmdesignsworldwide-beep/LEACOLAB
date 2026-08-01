# Beauty by Leela — Estética Avanzada

Sitio profesional del centro de restauración de piel y autoestima dirigido por
Marianny Belén (Santo Domingo, RD). El sitio #1 de estética en República Dominicana.

## Stack
- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** (animación) · animaciones scroll-driven nativas de CSS
- **shadcn/ui** (primitivas)
- **Supabase** (PostgreSQL + Storage) — RLS + FORCE en todas las tablas
- **Vercel** (deploy desde `main`) · **Resend** (email) · **Setmore** (agendamiento)

## Sistema de diseño
- **Display:** Fraunces (variable, WONK bajo · SOFT moderado · opsz alto)
- **Cuerpo/UI:** Geist
- Paleta: crema/mármol/dorado con rosa como acento controlado (≤15% por pantalla)

## Seguridad (Fort Knox)
- Secretos fuera del repo (`.env*` ignorado). `service_role` solo en servidor.
- RLS + FORCE, validación de permisos en servidor, rate limiting server-side.
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy).

## Skills instalados (`.claude/skills/`)
`ui-ux-pro-max` (auditor de calidad/accesibilidad, **no** director de arte),
`ui-styling`, `design`, `design-system`, `brand`, `slides`, `banner-design`.

---
_Diseñado por JM Nexus Designs._

---

## Configuración de Vercel
El framework queda fijado en `vercel.json` (`"framework": "nextjs"`), que tiene prioridad sobre
el preset del dashboard — el build no depende de ninguna configuración manual en la interfaz.

---

## 🚦 Restricción activa de rendimiento — LCP
El presupuesto es **LCP < 2.5s en móvil (4G)** y **JS de ruta inicial < 200 KB comprimido**.
En la Tanda 1, con throttling **real** (devtools), el LCP quedó en **1.6s** (FCP = LCP). El método
**simulado** (Lantern / PageSpeed Insights) reporta ~2.6s por una sobrestimación de render-delay.

**Regla:** cada tanda que agregue peso (imágenes, librerías, componentes pesados) **reporta el
LCP móvil en su PR**. Si supera 2.5s (throttling real), **se corrige en esa misma tanda**, no al final.
La imagen del hero (Tanda 3) es el riesgo principal: exige AVIF, `priority` y `fetchPriority="high"`.

### 🔒 REGLA DE ORO — above-the-fold sin JavaScript
**Nada por encima del pliegue puede depender de JavaScript para ser visible.** El texto del primer
pliegue debe ser pintable desde el HTML inicial — **nunca** `opacity: 0` puesto por JS (Framer
`initial`). Animar la opacidad del elemento LCP lo hunde bajo throttling (fue la causa del LCP alto
en Tanda 1). Framer Motion se reserva para **después** del primer pliegue: scroll, transiciones de
sección, micro-interacciones.

### ⚠️ Tanda 3 — animación del titular del hero: CSS PURO, no JS
El documento de movimiento pide el titular entrando por máscara, palabra por palabra
(`overflow:hidden`, cada palabra sube desde `y:100%`, stagger 70ms). **Implementarlo con Framer
montando estado inicial vuelve a hundir el LCP.** Hacerlo así:
- **Keyframes CSS** que corran solos, sin esperar hidratación.
- El texto **existe y es pintable** desde el HTML inicial (nada de `opacity:0` por JS).
- Estado inicial con `@starting-style` o keyframes que **arranquen desde visible** y hagan el
  recorrido, no al revés.
- Máscara (`overflow:hidden`) y `transform` de las palabras = CSS; el **stagger con
  `animation-delay` calculado por índice**, no con orquestación de JS.

---

## ⚠️ Deuda técnica — CHECKLIST DE LANZAMIENTO (Tanda 12)
Estos puntos quedan puestos a propósito mientras el sitio está en construcción.
**Retirarlos/actualizarlos es requisito de lanzamiento — olvidarlos sería el peor error.**

- [ ] **Retirar el `noindex` GLOBAL** en las 3 capas: `robots` del metadata del layout raíz,
      `app/robots.ts` (cambiar `disallow: ["/", "/portal"]` → `["/portal"]`), y el header global
      `noindexGlobal` en `next.config.mjs` (source `/:path*`).
      - 🚨 **NO TOCAR EL `noindex` DEL PORTAL.** Es PERMANENTE y vive aparte: `app/portal/layout.tsx`,
        la regla `/portal` en `robots.ts`, y `noindexPortal` (source `/portal/:path*`) en `next.config.mjs`.
        El día del lanzamiento se retira noindex de todos lados — **ESE es el momento en que se expone
        el panel de admin por error. El del portal se queda.**
- [ ] **`NEXT_PUBLIC_SITE_URL`** por entorno: Production = `https://beautybyleela.com`,
      Preview = URL de preview de Vercel. Sin esto, Google indexa el dominio de Vercel.
- [ ] Apuntar el dominio `beautybyleela.com` a Vercel **solo con A/CNAME** — no tocar los MX (correo).
- [ ] Confirmar subdominio real de Setmore (`bylela` vs `byleela`) y actualizar la env var.
- [ ] **Pasada de rendimiento:** investigar el LCP del método **simulado** (Lantern / PageSpeed
      Insights) — en Tanda 1 marcaba ~2.6s (real 1.6s). Es el número que ve cualquiera que evalúe
      el sitio desde fuera; la palanca es recortar Framer Motion del hilo principal.
- [ ] **Activar `auth_leaked_password_protection`** en Supabase → Authentication → Policies
      (Password Protection). Lo marca el Security Advisor como WARN; es un toggle, no requiere código.
- [ ] **Heartbeat de Supabase** (GitHub Actions) para que el proyecto free no se pause por
      inactividad — un cron que haga un `select` trivial cada pocos días.
- [ ] **SEO / Schema:** metadatos por página (títulos y `description`), OpenGraph, `sitemap.xml`,
      y Schema `LocalBusiness` — este último **solo cuando la clienta confirme las coordenadas**
      del Google Business (ver `docs/DATOS-NEGOCIO.md`).
