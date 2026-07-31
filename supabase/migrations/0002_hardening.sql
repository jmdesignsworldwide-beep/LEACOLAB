-- ============================================================================
-- Beauty by Leela — Tanda 2: endurecimiento (Security Advisor -> 0/0)
-- ============================================================================

-- 1) search_path fijo en las funciones que faltaban
alter function public.set_updated_at() set search_path = public;
alter function public.fn_audit_inmutable() set search_path = public;

-- 2) eventos: política de INSERT sin "always true" (exige tipo)
drop policy if exists ins_eventos on public.eventos;
create policy ins_eventos on public.eventos for insert with check (tipo is not null);

-- 3) bucket 'publico': quitar el listado abierto. Los archivos públicos se
--    sirven por URL directa; el portal lista con service_role (bypassa RLS).
drop policy if exists storage_publico_sel on storage.objects;

-- 4) Ninguna función SECURITY DEFINER debe ser ejecutable vía /rest/v1/rpc por
--    anon/authenticated. Revocar de public/anon/authenticated no rompe RLS
--    (verificado: la evaluación de políticas no exige EXECUTE al llamador).
do $$
declare f text;
begin
  foreach f in array array[
    'public.portal_rol()',
    'public.es_admin()',
    'public.es_staff()',
    'public.check_caso_publicable()',
    'public.fn_audit_full()',
    'public.fn_audit_sin_pii()',
    'public.fn_audit_inmutable()',
    'public.set_updated_at()',
    'public.rollup_eventos_diarios()',
    'public.purgar_leads_inactivos()'
  ] loop
    execute format('revoke execute on function %s from public, anon, authenticated', f);
  end loop;
end $$;
