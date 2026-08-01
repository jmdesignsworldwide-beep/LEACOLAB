-- ─────────────────────────────────────────────────────────────────────────
-- Tanda 8 — Galería de transformaciones: URLs firmadas del bucket privado
--
-- Las fotos antes/después viven en el bucket PRIVADO `casos`. El sitio público
-- no las sirve por URL pública: genera URLs firmadas de corta duración en el
-- servidor (cliente anónimo). Para poder firmar una imagen, el rol necesita
-- permiso SELECT sobre ese objeto en storage.objects.
--
-- Esta política deja firmar SOLO las imágenes que pertenecen a un caso
-- publicado y no borrado. La base decide qué se puede mostrar (pilar 3): si un
-- caso no está publicado, su imagen no se puede firmar ni ver.
--
-- Es aditiva: la política de staff (acceso total al bucket) se conserva.
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists storage_casos_sel_publicos on storage.objects;

create policy storage_casos_sel_publicos on storage.objects
  for select
  using (
    bucket_id = 'casos'
    and exists (
      select 1
      from public.casos c
      where c.publicado
        and c.deleted_at is null
        and (
          c.imagen_antes_path = storage.objects.name
          or c.imagen_despues_path = storage.objects.name
        )
    )
  );
