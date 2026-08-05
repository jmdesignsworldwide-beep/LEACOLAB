-- ─────────────────────────────────────────────────────────────────────────
-- Módulo de Inteligencia del Visitante — almacenamiento agregado
--
-- El crudo entra en `eventos` (ya existe; INSERT anónimo, purga a 90 días).
-- Esta migración añade tablas de AGREGADO que el panel lee (rápido aunque el
-- crudo tenga millones de filas) y un rollup diario que las llena.
--
-- Privacidad: solo se agregan campos de la lista blanca del capturador. El
-- `sid` es un identificador de sesión ANÓNIMO y efímero; nunca identifica a
-- una persona. No hay IP en ninguna parte.
--
-- RLS: lectura SOLO para admin (la editora no ve analítica). Nadie escribe en
-- estas tablas desde el cliente: solo el rollup (SECURITY DEFINER).
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Cerrar la analítica agregada previa a solo-admin (antes era staff).
drop policy if exists sel_eventos_diarios_staff on public.eventos_diarios;
create policy sel_eventos_diarios_admin on public.eventos_diarios
  for select using (private.es_admin());

-- 2) Tablas de agregado
create table if not exists public.intel_resumen (
  fecha date not null,
  disp text not null default 'e',
  sesiones int not null default 0,
  vistas int not null default 0,
  ms_total bigint not null default 0,
  primary key (fecha, disp)
);

create table if not exists public.intel_geo (
  fecha date not null,
  pais text not null default '',
  region text not null default '',
  ciudad text not null default '',
  sesiones int not null default 0,
  primary key (fecha, pais, region, ciudad)
);

create table if not exists public.intel_clicks (
  fecha date not null,
  path text not null,
  disp text not null default 'e',
  gx int not null,   -- rejilla 0..19 (x normalizada / 5)
  gy int not null,   -- rejilla 0..39 (y normalizada / 2.5)
  clase text not null default 'otro',
  conteo int not null default 0,
  primary key (fecha, path, disp, gx, gy, clase)
);

create table if not exists public.intel_scroll (
  fecha date not null,
  path text not null,
  disp text not null default 'e',
  depth int not null,  -- 0,25,50,75,100 (max alcanzado en la sesión)
  sesiones int not null default 0,
  primary key (fecha, path, disp, depth)
);

create table if not exists public.intel_secciones (
  fecha date not null,
  path text not null,
  seccion text not null,
  ms_total bigint not null default 0,
  muestras int not null default 0,
  primary key (fecha, path, seccion)
);

create table if not exists public.intel_frustracion (
  fecha date not null,
  path text not null,
  tipo text not null,        -- muerto | rabia | retroceso | erratico
  seccion text not null default '',
  conteo int not null default 0,
  primary key (fecha, path, tipo, seccion)
);

create table if not exists public.intel_embudo (
  fecha date not null,
  paso text not null,        -- 1_visita ... 6_agendar
  sesiones int not null default 0,
  primary key (fecha, paso)
);

create table if not exists public.intel_recorridos (
  fecha date not null,
  ruta text not null,
  convirtio boolean not null default false,
  conteo int not null default 0,
  primary key (fecha, ruta, convirtio)
);

-- 3) RLS: lectura solo admin; sin políticas de escritura (solo el rollup).
do $$
declare t text;
begin
  foreach t in array array[
    'intel_resumen','intel_geo','intel_clicks','intel_scroll',
    'intel_secciones','intel_frustracion','intel_embudo','intel_recorridos'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('drop policy if exists sel_%I_admin on public.%I', t, t);
    execute format(
      'create policy sel_%I_admin on public.%I for select using (private.es_admin())',
      t, t
    );
  end loop;
end $$;

-- 4) Rollup del crudo → agregados. Idempotente por día (delete+insert), para
--    poder re-procesar días perdidos si el proyecto estuvo pausado.
create or replace function public.rollup_inteligencia_dia(d date)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- limpiar el día (re-ejecución segura)
  delete from intel_resumen     where fecha = d;
  delete from intel_geo         where fecha = d;
  delete from intel_clicks      where fecha = d;
  delete from intel_scroll      where fecha = d;
  delete from intel_secciones   where fecha = d;
  delete from intel_frustracion where fecha = d;
  delete from intel_embudo      where fecha = d;
  delete from intel_recorridos  where fecha = d;

  -- resumen (sesiones, vistas, tiempo) por dispositivo
  insert into intel_resumen (fecha, disp, sesiones, vistas, ms_total)
  select d,
         coalesce(meta->>'d','e'),
         count(distinct meta->>'sid'),
         count(*) filter (where tipo = 'pageview'),
         coalesce(sum((meta->>'ms')::bigint) filter (where tipo = 'salida'), 0)
  from eventos
  where created_at::date = d and meta ? 'sid'
  group by coalesce(meta->>'d','e');

  -- de dónde son
  insert into intel_geo (fecha, pais, region, ciudad, sesiones)
  select d, pais, region, ciudad, count(distinct meta->>'sid')
  from eventos
  where created_at::date = d and meta ? 'sid'
  group by pais, region, ciudad;

  -- mapa de calor de clics (rejilla)
  insert into intel_clicks (fecha, path, disp, gx, gy, clase, conteo)
  select d, path, coalesce(meta->>'d','e'),
         least(19, greatest(0, floor((meta->>'x')::numeric / 5)))::int,
         least(39, greatest(0, floor((meta->>'y')::numeric / 2.5)))::int,
         coalesce(meta->>'clase','otro'), count(*)
  from eventos
  where created_at::date = d and tipo = 'click'
    and meta ? 'x' and meta ? 'y'
  group by path, coalesce(meta->>'d','e'),
           least(19, greatest(0, floor((meta->>'x')::numeric / 5)))::int,
           least(39, greatest(0, floor((meta->>'y')::numeric / 2.5)))::int,
           coalesce(meta->>'clase','otro');

  -- mapa de scroll (profundidad máxima por sesión, de la salida)
  insert into intel_scroll (fecha, path, disp, depth, sesiones)
  select d, path, coalesce(meta->>'d','e'),
         (round((meta->>'depth')::numeric / 25) * 25)::int, count(distinct meta->>'sid')
  from eventos
  where created_at::date = d and tipo = 'salida' and meta ? 'depth'
  group by path, coalesce(meta->>'d','e'),
           (round((meta->>'depth')::numeric / 25) * 25)::int;

  -- tiempo por sección
  insert into intel_secciones (fecha, path, seccion, ms_total, muestras)
  select d, path, meta->>'seccion', sum((meta->>'ms')::bigint), count(*)
  from eventos
  where created_at::date = d and tipo = 'tiempo_seccion'
    and coalesce(meta->>'seccion','') <> ''
  group by path, meta->>'seccion';

  -- señales de frustración
  insert into intel_frustracion (fecha, path, tipo, seccion, conteo)
  select d, path, meta->>'tipo', coalesce(meta->>'seccion',''), count(*)
  from eventos
  where created_at::date = d and tipo = 'frustracion' and meta ? 'tipo'
  group by path, meta->>'tipo', coalesce(meta->>'seccion','');

  -- embudo de conversión (una fila por paso, sesiones que lo alcanzaron)
  with s as (
    select meta->>'sid' sid,
           bool_or(tipo = 'pageview') visita,
           bool_or(tipo = 'pageview' and path like '/protocolos%') ve_prot,
           bool_or(tipo = 'pageview' and path = '/diagnostico') inicia,
           bool_or(tipo = 'meta_evento' and meta->>'nombre' = 'diagnostico-fin') termina,
           bool_or(tipo = 'meta_evento' and meta->>'nombre' = 'contacto-enviado') contacto,
           bool_or(tipo = 'meta_evento' and meta->>'nombre' = 'agendar') agendar
    from eventos
    where created_at::date = d and meta ? 'sid'
    group by meta->>'sid'
  )
  insert into intel_embudo (fecha, paso, sesiones)
  select d, paso, sesiones from (
    select '1_visita' paso, count(*) filter (where visita) sesiones from s
    union all select '2_protocolos', count(*) filter (where ve_prot) from s
    union all select '3_inicia_diagnostico', count(*) filter (where inicia) from s
    union all select '4_termina_diagnostico', count(*) filter (where termina) from s
    union all select '5_deja_contacto', count(*) filter (where contacto) from s
    union all select '6_agendar', count(*) filter (where agendar) from s
  ) x;

  -- recorridos (secuencia de páginas por sesión) + si convirtió
  with pv as (
    select meta->>'sid' sid, path, min(created_at) t
    from eventos
    where created_at::date = d and tipo = 'pageview' and meta ? 'sid'
    group by meta->>'sid', path
  ),
  rutas as (
    select sid, left(string_agg(path, ' > ' order by t), 300) ruta
    from pv group by sid
  ),
  conv as (
    select meta->>'sid' sid,
           bool_or(tipo = 'meta_evento' and meta->>'nombre' in ('agendar','contacto-enviado')) c
    from eventos
    where created_at::date = d and meta ? 'sid'
    group by meta->>'sid'
  )
  insert into intel_recorridos (fecha, ruta, convirtio, conteo)
  select d, r.ruta, coalesce(c.c, false), count(*)
  from rutas r left join conv c using (sid)
  group by r.ruta, coalesce(c.c, false);
end $$;

-- Envoltura con RECUPERACIÓN: procesa los últimos `dias` días. Si el proyecto
-- estuvo pausado y pg_cron se saltó una corrida, la siguiente rellena hasta 3
-- días atrás. Es lo que llamará el latido de GitHub Actions (Tanda 13), que
-- corre en infra externa y despierta + procesa aunque Supabase estuviera dormido.
create or replace function public.rollup_inteligencia(dias int default 3)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare i int;
begin
  for i in 0 .. greatest(0, dias - 1) loop
    perform public.rollup_inteligencia_dia((current_date - 1 - i)::date);
  end loop;
  -- Salvaguarda de retención: por si la purga de eventos no corrió (proyecto
  -- pausado), volver a limpiar el crudo antiguo aquí también.
  delete from public.eventos where created_at < now() - interval '90 days';
end $$;

revoke all on function public.rollup_inteligencia_dia(date) from anon, authenticated;
revoke all on function public.rollup_inteligencia(int) from anon, authenticated;

-- 5) pg_cron como red secundaria (00:20 UTC). El motor PRINCIPAL y confiable
--    será el latido de GitHub Actions llamando a rollup_inteligencia(3).
select cron.schedule('bbl-rollup-inteligencia', '20 0 * * *',
  $$ select public.rollup_inteligencia(3); $$);
