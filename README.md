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
En la Tanda 1 (solo shell, sin fotos) el LCP quedó en ~2.6s — **ya rozando el límite**.

**Regla:** cada tanda que agregue peso (imágenes, librerías, componentes pesados) **reporta el
LCP móvil en su PR**. Si supera 2.5s, **se corrige en esa misma tanda**, no al final.
La imagen del hero (Tanda 3) es el riesgo principal: exige AVIF, `priority` y `fetchPriority="high"`.

---

## ⚠️ Deuda técnica — CHECKLIST DE LANZAMIENTO (Tanda 12)
Estos puntos quedan puestos a propósito mientras el sitio está en construcción.
**Retirarlos/actualizarlos es requisito de lanzamiento — olvidarlos sería el peor error.**

- [ ] **Retirar el `noindex`** en las 3 capas: `<meta name="robots">` del placeholder / metadata del
      layout raíz de Next, header `X-Robots-Tag` en `vercel.json`, y `robots.txt` (`Disallow: /`).
- [ ] **`NEXT_PUBLIC_SITE_URL`** por entorno: Production = `https://beautybyleela.com`,
      Preview = URL de preview de Vercel. Sin esto, Google indexa el dominio de Vercel.
- [ ] Apuntar el dominio `beautybyleela.com` a Vercel **solo con A/CNAME** — no tocar los MX (correo).
- [ ] Confirmar subdominio real de Setmore (`bylela` vs `byleela`) y actualizar la env var.
