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

## 🔧 Pendientes al empezar la Tanda 1
- [ ] **Vercel → Framework Preset: devolver a `Next.js`.** Durante la Tanda 0 se puso en
      `Other` (aún no había app Next.js y el build fallaba). Al scaffoldear Next.js en la Tanda 1,
      cambiarlo de vuelta en Vercel → Project → Settings → Build & Development Settings.
- [ ] Retirar el placeholder estático (`index.html`, `favicon.svg`, `robots.txt`) al montar la app Next.js
      (el `noindex` se migra al metadata del layout raíz y se mantiene hasta Tanda 12).

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
