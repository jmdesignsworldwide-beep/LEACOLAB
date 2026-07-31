-- ============================================================================
-- Beauty by Leela — Tanda 2: helpers de RLS a schema privado
-- Los helpers deben ser ejecutables por anon/authenticated para que RLS
-- funcione, pero NO deben exponerse vía /rest/v1/rpc. Solución estándar:
-- moverlos a un schema `private` que PostgREST no expone.
-- ============================================================================

create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.portal_rol()
returns text language sql stable security definer set search_path = public as $$
  select rol from public.usuarios_portal where id = auth.uid() and activo = true
$$;
create or replace function private.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(private.portal_rol() = 'admin', false)
$$;
create or replace function private.es_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(private.portal_rol() in ('admin','editor'), false)
$$;
grant execute on function private.portal_rol(), private.es_admin(), private.es_staff()
  to anon, authenticated, service_role;

-- Bitácora: usar el helper privado (se dropea el público más abajo)
create or replace function public.fn_audit_full()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log(actor, actor_rol, accion, tabla, registro_id, diff)
  values (auth.uid(), private.portal_rol(), lower(tg_op), tg_table_name,
          coalesce((row_to_json(case when tg_op='DELETE' then old else new end)->>'id'),''),
          case when tg_op='DELETE' then row_to_json(old)::jsonb else row_to_json(new)::jsonb end);
  return case when tg_op='DELETE' then old else new end;
end $$;
create or replace function public.fn_audit_sin_pii()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log(actor, actor_rol, accion, tabla, registro_id, diff)
  values (auth.uid(), private.portal_rol(), lower(tg_op), tg_table_name,
          coalesce((row_to_json(case when tg_op='DELETE' then old else new end)->>'id'),''),
          null);
  return case when tg_op='DELETE' then old else new end;
end $$;
revoke execute on function public.fn_audit_full(), public.fn_audit_sin_pii()
  from public, anon, authenticated;

-- ── Recrear políticas apuntando a private.* ─────────────────────────────────
-- protocolos
drop policy if exists sel_staff_protocolos on public.protocolos;
drop policy if exists ins_protocolos on public.protocolos;
drop policy if exists upd_protocolos on public.protocolos;
drop policy if exists del_protocolos on public.protocolos;
create policy sel_staff_protocolos on public.protocolos for select using (private.es_staff());
create policy ins_protocolos on public.protocolos for insert with check (private.es_staff());
create policy upd_protocolos on public.protocolos for update using (private.es_staff()) with check (private.es_staff());
create policy del_protocolos on public.protocolos for delete using (private.es_admin());

-- fases_protocolo
drop policy if exists sel_staff_fases on public.fases_protocolo;
drop policy if exists ins_fases on public.fases_protocolo;
drop policy if exists upd_fases on public.fases_protocolo;
drop policy if exists del_fases on public.fases_protocolo;
create policy sel_staff_fases on public.fases_protocolo for select using (private.es_staff());
create policy ins_fases on public.fases_protocolo for insert with check (private.es_staff());
create policy upd_fases on public.fases_protocolo for update using (private.es_staff()) with check (private.es_staff());
create policy del_fases on public.fases_protocolo for delete using (private.es_admin());

-- especialistas
drop policy if exists sel_staff_especialistas on public.especialistas;
drop policy if exists ins_especialistas on public.especialistas;
drop policy if exists upd_especialistas on public.especialistas;
drop policy if exists del_especialistas on public.especialistas;
create policy sel_staff_especialistas on public.especialistas for select using (private.es_staff());
create policy ins_especialistas on public.especialistas for insert with check (private.es_staff());
create policy upd_especialistas on public.especialistas for update using (private.es_staff()) with check (private.es_staff());
create policy del_especialistas on public.especialistas for delete using (private.es_admin());

-- casos
drop policy if exists sel_staff_casos on public.casos;
drop policy if exists ins_casos on public.casos;
drop policy if exists upd_casos on public.casos;
drop policy if exists del_casos on public.casos;
create policy sel_staff_casos on public.casos for select using (private.es_staff());
create policy ins_casos on public.casos for insert with check (private.es_staff());
create policy upd_casos on public.casos for update using (private.es_staff()) with check (private.es_staff());
create policy del_casos on public.casos for delete using (private.es_admin());

-- resenas
drop policy if exists sel_staff_resenas on public.resenas;
drop policy if exists ins_resenas on public.resenas;
drop policy if exists upd_resenas on public.resenas;
drop policy if exists del_resenas on public.resenas;
create policy sel_staff_resenas on public.resenas for select using (private.es_staff());
create policy ins_resenas on public.resenas for insert with check (private.es_staff());
create policy upd_resenas on public.resenas for update using (private.es_staff()) with check (private.es_staff());
create policy del_resenas on public.resenas for delete using (private.es_admin());

-- contenido
drop policy if exists ins_contenido on public.contenido;
drop policy if exists upd_contenido on public.contenido;
drop policy if exists del_contenido on public.contenido;
create policy ins_contenido on public.contenido for insert with check (private.es_staff());
create policy upd_contenido on public.contenido for update using (private.es_staff()) with check (private.es_staff());
create policy del_contenido on public.contenido for delete using (private.es_admin());

-- programas_formacion
drop policy if exists sel_staff_formacion on public.programas_formacion;
drop policy if exists ins_formacion on public.programas_formacion;
drop policy if exists upd_formacion on public.programas_formacion;
drop policy if exists del_formacion on public.programas_formacion;
create policy sel_staff_formacion on public.programas_formacion for select using (private.es_staff());
create policy ins_formacion on public.programas_formacion for insert with check (private.es_staff());
create policy upd_formacion on public.programas_formacion for update using (private.es_staff()) with check (private.es_staff());
create policy del_formacion on public.programas_formacion for delete using (private.es_admin());

-- consentimientos (solo admin)
drop policy if exists consent_admin_all on public.consentimientos;
create policy consent_admin_all on public.consentimientos for all
  using (private.es_admin()) with check (private.es_admin());

-- leads_diagnostico
drop policy if exists sel_leads_admin on public.leads_diagnostico;
drop policy if exists upd_leads_admin on public.leads_diagnostico;
drop policy if exists del_leads_admin on public.leads_diagnostico;
create policy sel_leads_admin on public.leads_diagnostico for select using (private.es_admin());
create policy upd_leads_admin on public.leads_diagnostico for update using (private.es_admin()) with check (private.es_admin());
create policy del_leads_admin on public.leads_diagnostico for delete using (private.es_admin());

-- inscripciones_formacion
drop policy if exists sel_inscripciones_admin on public.inscripciones_formacion;
drop policy if exists upd_inscripciones_admin on public.inscripciones_formacion;
drop policy if exists del_inscripciones_admin on public.inscripciones_formacion;
create policy sel_inscripciones_admin on public.inscripciones_formacion for select using (private.es_admin());
create policy upd_inscripciones_admin on public.inscripciones_formacion for update using (private.es_admin()) with check (private.es_admin());
create policy del_inscripciones_admin on public.inscripciones_formacion for delete using (private.es_admin());

-- mensajes_contacto
drop policy if exists sel_mensajes_admin on public.mensajes_contacto;
drop policy if exists upd_mensajes_admin on public.mensajes_contacto;
drop policy if exists del_mensajes_admin on public.mensajes_contacto;
create policy sel_mensajes_admin on public.mensajes_contacto for select using (private.es_admin());
create policy upd_mensajes_admin on public.mensajes_contacto for update using (private.es_admin()) with check (private.es_admin());
create policy del_mensajes_admin on public.mensajes_contacto for delete using (private.es_admin());

-- eventos_diarios
drop policy if exists sel_eventos_diarios_staff on public.eventos_diarios;
create policy sel_eventos_diarios_staff on public.eventos_diarios for select using (private.es_staff());

-- usuarios_portal
drop policy if exists sel_usuarios on public.usuarios_portal;
drop policy if exists ins_usuarios_admin on public.usuarios_portal;
drop policy if exists upd_usuarios_admin on public.usuarios_portal;
drop policy if exists del_usuarios_admin on public.usuarios_portal;
create policy sel_usuarios on public.usuarios_portal for select using (id = auth.uid() or private.es_admin());
create policy ins_usuarios_admin on public.usuarios_portal for insert with check (private.es_admin());
create policy upd_usuarios_admin on public.usuarios_portal for update using (private.es_admin()) with check (private.es_admin());
create policy del_usuarios_admin on public.usuarios_portal for delete using (private.es_admin());

-- audit_log
drop policy if exists sel_audit_admin on public.audit_log;
create policy sel_audit_admin on public.audit_log for select using (private.es_admin());

-- storage.objects
drop policy if exists storage_publico_ins on storage.objects;
drop policy if exists storage_publico_upd on storage.objects;
drop policy if exists storage_publico_del on storage.objects;
create policy storage_publico_ins on storage.objects for insert with check (bucket_id = 'publico' and private.es_staff());
create policy storage_publico_upd on storage.objects for update using (bucket_id = 'publico' and private.es_staff());
create policy storage_publico_del on storage.objects for delete using (bucket_id = 'publico' and private.es_admin());

drop policy if exists storage_casos_sel on storage.objects;
drop policy if exists storage_casos_ins on storage.objects;
drop policy if exists storage_casos_upd on storage.objects;
drop policy if exists storage_casos_del on storage.objects;
create policy storage_casos_sel on storage.objects for select using (bucket_id = 'casos' and private.es_staff());
create policy storage_casos_ins on storage.objects for insert with check (bucket_id = 'casos' and private.es_staff());
create policy storage_casos_upd on storage.objects for update using (bucket_id = 'casos' and private.es_staff());
create policy storage_casos_del on storage.objects for delete using (bucket_id = 'casos' and private.es_admin());

drop policy if exists storage_consent_all on storage.objects;
create policy storage_consent_all on storage.objects for all
  using (bucket_id = 'consentimientos' and private.es_admin())
  with check (bucket_id = 'consentimientos' and private.es_admin());

-- Eliminar los helpers públicos (ya nada los referencia)
drop function if exists public.es_admin();
drop function if exists public.es_staff();
drop function if exists public.portal_rol();
