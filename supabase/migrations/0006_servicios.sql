-- ─────────────────────────────────────────────────────────────────────────
-- Sitio informativo: menú de Servicios con precios (por categoría).
-- Editable desde el portal. Dinero en RD$ (numeric). Lectura pública de lo
-- publicado; gestión por staff (mismo patrón que el resto del catálogo).
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  categoria text not null,              -- Faciales, Blanqueadores, Avanzados, …
  categoria_orden int not null default 0,
  nombre text not null,
  duracion_texto text,                  -- "50 min", "1 h"
  precio numeric(14,2),                 -- RD$; null si es "Gratuito" u otro
  precio_texto text,                    -- override: "Gratuito", "Desde …"
  detalle text,
  orden int not null default 0,
  publicado boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_servicios_cat on public.servicios (categoria_orden, orden);

alter table public.servicios enable row level security;
alter table public.servicios force row level security;

drop policy if exists sel_pub_servicios on public.servicios;
create policy sel_pub_servicios on public.servicios
  for select using (publicado and deleted_at is null);

drop policy if exists sel_staff_servicios on public.servicios;
create policy sel_staff_servicios on public.servicios
  for select using (private.es_staff());

drop policy if exists ins_servicios on public.servicios;
create policy ins_servicios on public.servicios
  for insert with check (private.es_staff());

drop policy if exists upd_servicios on public.servicios;
create policy upd_servicios on public.servicios
  for update using (private.es_staff()) with check (private.es_staff());

drop policy if exists del_servicios on public.servicios;
create policy del_servicios on public.servicios
  for delete using (private.es_admin());
