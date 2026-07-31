-- ============================================================================
-- Beauty by Leela — Tanda 2: esquema, Fort Knox, RLS, storage, eventos
-- Se aplica vía Management API dentro de la ventana del PAT temporal.
-- Idempotente donde es posible. Dinero SIEMPRE numeric(14,2).
-- ============================================================================

-- ── 0. Extensiones ──────────────────────────────────────────────────────────
create extension if not exists pgcrypto;
create extension if not exists pg_cron;

-- ── 1. Helpers ──────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- Rol del usuario del portal para el auth.uid() actual (o null).
create or replace function public.portal_rol()
returns text language sql stable security definer set search_path = public as $$
  select rol from public.usuarios_portal where id = auth.uid() and activo = true
$$;

create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.portal_rol() = 'admin', false)
$$;

create or replace function public.es_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.portal_rol() in ('admin','editor'), false)
$$;

-- ── 2. Tablas ───────────────────────────────────────────────────────────────

-- Usuarios del portal (enlazados a auth.users)
create table if not exists public.usuarios_portal (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('admin','editor')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Consentimientos de imagen (documento firmado, bucket privado, solo admin)
create table if not exists public.consentimientos (
  id uuid primary key default gen_random_uuid(),
  paciente_nombre text not null,
  fecha_autorizacion date not null,
  documento_path text,                       -- archivo en bucket privado 'consentimientos'
  permite_rostro boolean not null default false,
  permite_redes boolean not null default false,
  permite_sitio_web boolean not null default false,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Protocolos + fases
create table if not exists public.protocolos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  para_quien text,
  duracion_texto text,
  incluye text[] not null default '{}',
  no_incluye text[] not null default '{}',
  inversion_min numeric(14,2),
  inversion_max numeric(14,2),
  imagen_path text,
  orden int not null default 0,
  publicado boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fases_protocolo (
  id uuid primary key default gen_random_uuid(),
  protocolo_id uuid not null references public.protocolos(id) on delete cascade,
  numero int not null,
  nombre text not null,
  descripcion text,
  duracion_texto text,
  orden int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Especialistas
create table if not exists public.especialistas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  especialidad text,
  anios int,
  bio text,
  foto_path text,
  orden int not null default 0,
  publicado boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Casos antes/después (consentimiento como relación real)
create table if not exists public.casos (
  id uuid primary key default gen_random_uuid(),
  condicion text not null,
  protocolo_id uuid references public.protocolos(id) on delete set null,
  consentimiento_id uuid references public.consentimientos(id) on delete restrict,
  semana_tratamiento int,
  imagen_antes_path text,
  imagen_despues_path text,
  notas text,
  orden int not null default 0,
  publicado boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reseñas (paciente / alumna)
create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  texto text not null,
  tipo text not null default 'paciente' check (tipo in ('paciente','alumna')),
  especialista_id uuid references public.especialistas(id) on delete set null,
  rating int check (rating between 1 and 5),
  fuente text,
  destacada boolean not null default false,
  publicado boolean not null default false,
  orden int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contenido editable (textos + datos de contacto) clave/valor
create table if not exists public.contenido (
  id uuid primary key default gen_random_uuid(),
  clave text unique not null,
  valor jsonb not null default '{}'::jsonb,
  descripcion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Formación (segundo negocio)
create table if not exists public.programas_formacion (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  tipo text not null check (tipo in ('curso','mentoria','clase_privada')),
  para_quien text,
  requisitos text,
  modalidad text check (modalidad in ('presencial','virtual','hibrida')),
  duracion_texto text,
  cupo int,
  temario text[] not null default '{}',
  inversion numeric(14,2),
  imagen_path text,
  orden int not null default 0,
  activo boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bandejas de captación (SIN lectura pública). Consentimiento 172-13 obligatorio.
create table if not exists public.leads_diagnostico (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  segmento text,
  antiguedad text,
  intento_previo text,
  tipo_piel text,
  urgencia text,
  busca_formacion boolean not null default false,
  protocolo_sugerido text,
  nombre text,
  whatsapp text,
  correo text,
  estado_seguimiento text not null default 'nuevo'
    check (estado_seguimiento in ('nuevo','contactado','agendado','descartado')),
  notas text,
  consentimiento_contacto boolean not null check (consentimiento_contacto = true),
  consentimiento_fecha timestamptz not null default now(),
  consentimiento_texto_version text not null
);

create table if not exists public.inscripciones_formacion (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  programa_id uuid references public.programas_formacion(id) on delete set null,
  nombre text,
  whatsapp text,
  correo text,
  mensaje text,
  estado_seguimiento text not null default 'nuevo'
    check (estado_seguimiento in ('nuevo','contactado','inscrito','descartado')),
  notas text,
  consentimiento_contacto boolean not null check (consentimiento_contacto = true),
  consentimiento_fecha timestamptz not null default now(),
  consentimiento_texto_version text not null
);

create table if not exists public.mensajes_contacto (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text,
  contacto text,
  mensaje text,
  origen text,
  estado_seguimiento text not null default 'nuevo'
    check (estado_seguimiento in ('nuevo','contactado','resuelto','descartado')),
  notas text,
  consentimiento_contacto boolean not null check (consentimiento_contacto = true),
  consentimiento_fecha timestamptz not null default now(),
  consentimiento_texto_version text not null
);

-- Analítica: crudo + agregado
create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  tipo text not null,
  path text,
  referer text,
  pais text,
  region text,
  ciudad text,
  meta jsonb not null default '{}'::jsonb
);
create index if not exists idx_eventos_created_at on public.eventos (created_at);

create table if not exists public.eventos_diarios (
  fecha date not null,
  pais text not null default '',
  region text not null default '',
  ciudad text not null default '',
  path text not null default '',
  tipo text not null,
  conteo int not null default 0,
  primary key (fecha, pais, region, ciudad, path, tipo)
);

-- Bitácora inmutable (append-only). Para tablas con PII NO se copia el contenido.
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor uuid,
  actor_rol text,
  accion text not null,
  tabla text not null,
  registro_id text,
  diff jsonb
);

-- ── 3. Triggers updated_at ──────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'usuarios_portal','consentimientos','protocolos','fases_protocolo','especialistas',
    'casos','resenas','contenido','programas_formacion','leads_diagnostico',
    'inscripciones_formacion','mensajes_contacto'
  ] loop
    execute format('drop trigger if exists trg_updated_at on public.%I', t);
    execute format('create trigger trg_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ── 4. Regla de publicación de casos (garantizada por la base) ───────────────
create or replace function public.check_caso_publicable()
returns trigger language plpgsql security definer set search_path = public as $$
declare c record;
begin
  if new.publicado then
    if new.consentimiento_id is null then
      raise exception 'No se puede publicar un caso sin consentimiento asociado';
    end if;
    select documento_path, permite_sitio_web into c
      from public.consentimientos where id = new.consentimiento_id;
    if c.documento_path is null then
      raise exception 'El consentimiento no tiene documento firmado cargado';
    end if;
    if not c.permite_sitio_web then
      raise exception 'El consentimiento no autoriza el uso en el sitio web';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_caso_publicable on public.casos;
create trigger trg_caso_publicable before insert or update on public.casos
  for each row execute function public.check_caso_publicable();

-- ── 5. Bitácora: full (contenido) y sin-PII (datos personales) ───────────────
create or replace function public.fn_audit_full()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log(actor, actor_rol, accion, tabla, registro_id, diff)
  values (auth.uid(), public.portal_rol(), lower(tg_op), tg_table_name,
          coalesce((row_to_json(case when tg_op='DELETE' then old else new end)->>'id'),''),
          case when tg_op='DELETE' then row_to_json(old)::jsonb else row_to_json(new)::jsonb end);
  return case when tg_op='DELETE' then old else new end;
end $$;

-- Para tablas con PII/salud: registra el hecho, NUNCA el contenido (Ley 172-13).
create or replace function public.fn_audit_sin_pii()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log(actor, actor_rol, accion, tabla, registro_id, diff)
  values (auth.uid(), public.portal_rol(), lower(tg_op), tg_table_name,
          coalesce((row_to_json(case when tg_op='DELETE' then old else new end)->>'id'),''),
          null);
  return case when tg_op='DELETE' then old else new end;
end $$;

do $$
declare t text;
begin
  -- contenido de negocio: bitácora completa
  foreach t in array array[
    'consentimientos','protocolos','fases_protocolo','especialistas','casos',
    'resenas','contenido','programas_formacion','usuarios_portal'
  ] loop
    execute format('drop trigger if exists trg_audit on public.%I', t);
    execute format('create trigger trg_audit after insert or update or delete on public.%I
                    for each row execute function public.fn_audit_full()', t);
  end loop;
  -- datos personales: bitácora sin PII
  foreach t in array array[
    'leads_diagnostico','inscripciones_formacion','mensajes_contacto'
  ] loop
    execute format('drop trigger if exists trg_audit on public.%I', t);
    execute format('create trigger trg_audit after insert or update or delete on public.%I
                    for each row execute function public.fn_audit_sin_pii()', t);
  end loop;
end $$;

-- Inmutabilidad de la bitácora
create or replace function public.fn_audit_inmutable()
returns trigger language plpgsql as $$
begin raise exception 'audit_log es inmutable'; end $$;
drop trigger if exists trg_audit_inmutable on public.audit_log;
create trigger trg_audit_inmutable before update or delete on public.audit_log
  for each row execute function public.fn_audit_inmutable();

-- ── 6. RLS + FORCE (deny-all por defecto) ───────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'usuarios_portal','consentimientos','protocolos','fases_protocolo','especialistas',
    'casos','resenas','contenido','programas_formacion','leads_diagnostico',
    'inscripciones_formacion','mensajes_contacto','eventos','eventos_diarios','audit_log'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;
end $$;

-- 6.1 Contenido público: lectura pública de lo publicado; gestión por staff
create policy sel_pub_protocolos on public.protocolos for select
  using (publicado and deleted_at is null);
create policy sel_staff_protocolos on public.protocolos for select using (public.es_staff());
create policy ins_protocolos on public.protocolos for insert with check (public.es_staff());
create policy upd_protocolos on public.protocolos for update using (public.es_staff()) with check (public.es_staff());
create policy del_protocolos on public.protocolos for delete using (public.es_admin());

create policy sel_pub_fases on public.fases_protocolo for select
  using (deleted_at is null and exists (
    select 1 from public.protocolos p where p.id = protocolo_id and p.publicado and p.deleted_at is null));
create policy sel_staff_fases on public.fases_protocolo for select using (public.es_staff());
create policy ins_fases on public.fases_protocolo for insert with check (public.es_staff());
create policy upd_fases on public.fases_protocolo for update using (public.es_staff()) with check (public.es_staff());
create policy del_fases on public.fases_protocolo for delete using (public.es_admin());

create policy sel_pub_especialistas on public.especialistas for select using (publicado and deleted_at is null);
create policy sel_staff_especialistas on public.especialistas for select using (public.es_staff());
create policy ins_especialistas on public.especialistas for insert with check (public.es_staff());
create policy upd_especialistas on public.especialistas for update using (public.es_staff()) with check (public.es_staff());
create policy del_especialistas on public.especialistas for delete using (public.es_admin());

create policy sel_pub_casos on public.casos for select using (publicado and deleted_at is null);
create policy sel_staff_casos on public.casos for select using (public.es_staff());
create policy ins_casos on public.casos for insert with check (public.es_staff());
create policy upd_casos on public.casos for update using (public.es_staff()) with check (public.es_staff());
create policy del_casos on public.casos for delete using (public.es_admin());

create policy sel_pub_resenas on public.resenas for select using (publicado and deleted_at is null);
create policy sel_staff_resenas on public.resenas for select using (public.es_staff());
create policy ins_resenas on public.resenas for insert with check (public.es_staff());
create policy upd_resenas on public.resenas for update using (public.es_staff()) with check (public.es_staff());
create policy del_resenas on public.resenas for delete using (public.es_admin());

create policy sel_pub_contenido on public.contenido for select using (true);
create policy ins_contenido on public.contenido for insert with check (public.es_staff());
create policy upd_contenido on public.contenido for update using (public.es_staff()) with check (public.es_staff());
create policy del_contenido on public.contenido for delete using (public.es_admin());

create policy sel_pub_formacion on public.programas_formacion for select using (activo and deleted_at is null);
create policy sel_staff_formacion on public.programas_formacion for select using (public.es_staff());
create policy ins_formacion on public.programas_formacion for insert with check (public.es_staff());
create policy upd_formacion on public.programas_formacion for update using (public.es_staff()) with check (public.es_staff());
create policy del_formacion on public.programas_formacion for delete using (public.es_admin());

-- 6.2 Consentimientos: SOLO admin (ni la editora)
create policy consent_admin_all on public.consentimientos for all
  using (public.es_admin()) with check (public.es_admin());

-- 6.3 Bandejas de captación: INSERT anónimo (con consentimiento), lectura/gestión admin.
--     El acceso enmascarado de la editora se añade en la Tanda 3 (RPC SECURITY DEFINER).
create policy ins_leads on public.leads_diagnostico for insert
  with check (consentimiento_contacto = true);
create policy sel_leads_admin on public.leads_diagnostico for select using (public.es_admin());
create policy upd_leads_admin on public.leads_diagnostico for update using (public.es_admin()) with check (public.es_admin());
create policy del_leads_admin on public.leads_diagnostico for delete using (public.es_admin()); -- derecho de eliminación

create policy ins_inscripciones on public.inscripciones_formacion for insert
  with check (consentimiento_contacto = true);
create policy sel_inscripciones_admin on public.inscripciones_formacion for select using (public.es_admin());
create policy upd_inscripciones_admin on public.inscripciones_formacion for update using (public.es_admin()) with check (public.es_admin());
create policy del_inscripciones_admin on public.inscripciones_formacion for delete using (public.es_admin());

create policy ins_mensajes on public.mensajes_contacto for insert
  with check (consentimiento_contacto = true);
create policy sel_mensajes_admin on public.mensajes_contacto for select using (public.es_admin());
create policy upd_mensajes_admin on public.mensajes_contacto for update using (public.es_admin()) with check (public.es_admin());
create policy del_mensajes_admin on public.mensajes_contacto for delete using (public.es_admin());

-- 6.4 Eventos: INSERT anónimo; el crudo no se lee (el portal lee el agregado)
create policy ins_eventos on public.eventos for insert with check (true);
create policy sel_eventos_diarios_staff on public.eventos_diarios for select using (public.es_staff());

-- 6.5 Usuarios del portal: cada quien se ve a sí mismo; gestión solo admin
create policy sel_usuarios on public.usuarios_portal for select using (id = auth.uid() or public.es_admin());
create policy ins_usuarios_admin on public.usuarios_portal for insert with check (public.es_admin());
create policy upd_usuarios_admin on public.usuarios_portal for update using (public.es_admin()) with check (public.es_admin());
create policy del_usuarios_admin on public.usuarios_portal for delete using (public.es_admin());

-- 6.6 Bitácora: solo lectura admin (insert vía triggers SECURITY DEFINER)
create policy sel_audit_admin on public.audit_log for select using (public.es_admin());

-- ── 7. Storage: buckets + políticas ─────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('publico','publico', true),
  ('casos','casos', false),
  ('consentimientos','consentimientos', false)
on conflict (id) do nothing;

-- publico: lectura para todos; escritura staff
create policy storage_publico_sel on storage.objects for select using (bucket_id = 'publico');
create policy storage_publico_ins on storage.objects for insert with check (bucket_id = 'publico' and public.es_staff());
create policy storage_publico_upd on storage.objects for update using (bucket_id = 'publico' and public.es_staff());
create policy storage_publico_del on storage.objects for delete using (bucket_id = 'publico' and public.es_admin());

-- casos: privado; lectura/escritura staff (el público recibe URLs firmadas server-side)
create policy storage_casos_sel on storage.objects for select using (bucket_id = 'casos' and public.es_staff());
create policy storage_casos_ins on storage.objects for insert with check (bucket_id = 'casos' and public.es_staff());
create policy storage_casos_upd on storage.objects for update using (bucket_id = 'casos' and public.es_staff());
create policy storage_casos_del on storage.objects for delete using (bucket_id = 'casos' and public.es_admin());

-- consentimientos: SOLO admin
create policy storage_consent_all on storage.objects for all
  using (bucket_id = 'consentimientos' and public.es_admin())
  with check (bucket_id = 'consentimientos' and public.es_admin());

-- ── 8. Agregación y retención de eventos (pg_cron) ──────────────────────────
create or replace function public.rollup_eventos_diarios()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.eventos_diarios (fecha, pais, region, ciudad, path, tipo, conteo)
  select (created_at at time zone 'America/Santo_Domingo')::date,
         coalesce(pais,''), coalesce(region,''), coalesce(ciudad,''),
         coalesce(path,''), tipo, count(*)
  from public.eventos
  where created_at < date_trunc('day', now())
  group by 1,2,3,4,5,6
  on conflict (fecha, pais, region, ciudad, path, tipo)
  do update set conteo = public.eventos_diarios.conteo + excluded.conteo;

  -- una vez consolidado el día, se puede purgar el crudo antiguo (>90 días)
  delete from public.eventos where created_at < now() - interval '90 days';
end $$;

-- Purga de leads de salud no convertidos con +24 meses sin actividad (Ley 172-13)
create or replace function public.purgar_leads_inactivos()
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.leads_diagnostico
  where estado_seguimiento in ('nuevo','descartado')
    and updated_at < now() - interval '24 months';
end $$;

-- Programación diaria (00:15 y 00:30 UTC)
select cron.schedule('bbl-rollup-eventos', '15 0 * * *', $$ select public.rollup_eventos_diarios(); $$);
select cron.schedule('bbl-purga-leads',   '30 0 1 * *', $$ select public.purgar_leads_inactivos(); $$);

-- ── 9. Endurecimiento de ejecución ──────────────────────────────────────────
revoke all on function public.rollup_eventos_diarios() from anon, authenticated;
revoke all on function public.purgar_leads_inactivos() from anon, authenticated;
