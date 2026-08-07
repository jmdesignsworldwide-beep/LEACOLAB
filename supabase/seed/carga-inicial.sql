-- ─────────────────────────────────────────────────────────────────────────
-- Carga inicial de contenido REAL (Beauty by Leela) — correr en ventana de PAT
-- tras aplicar la migración 0006_servicios.sql.
--
-- Idempotente: los servicios se recargan por completo; el contenido y el
-- equipo usan upsert / guardas. Precios en RD$.
-- Datos tomados de la agenda Setmore y la ficha del negocio.
-- ─────────────────────────────────────────────────────────────────────────

-- 1) SERVICIOS ──────────────────────────────────────────────────────────────
delete from public.servicios;  -- recarga limpia

insert into public.servicios
  (categoria, categoria_orden, nombre, duracion_texto, precio, orden, publicado)
values
  -- Tratamientos faciales
  ('Tratamientos faciales', 1, 'Esperma de salmón PDRN', '50 min', 12500, 1, true),
  ('Tratamientos faciales', 1, 'Peeling acné', '50 min', 3800, 2, true),
  ('Tratamientos faciales', 1, 'Dermaplaning + facial', '50 min', 4500, 3, true),
  ('Tratamientos faciales', 1, 'Especial jueves', '50 min', 2000, 4, true),
  ('Tratamientos faciales', 1, 'Primera cita + evaluación', '50 min', 3000, 5, true),
  ('Tratamientos faciales', 1, 'Facial profundo (seguimiento)', '50 min', 3000, 6, true),
  ('Tratamientos faciales', 1, 'Dermapen', '50 min', 5500, 7, true),
  ('Tratamientos faciales', 1, 'Hidratación profunda', '50 min', 3000, 8, true),
  ('Tratamientos faciales', 1, 'Tratamiento Casmara', '50 min', 4500, 9, true),

  -- Tratamientos blanqueadores
  ('Tratamientos blanqueadores', 2, 'Primera cita + evaluación', '50 min', 3000, 1, true),
  ('Tratamientos blanqueadores', 2, 'Cita para blanqueamiento (seguimiento)', '50 min', 3000, 2, true),

  -- Tratamientos avanzados
  ('Tratamientos avanzados', 3, 'Esperma de salmón PDRN', '50 min', 12500, 1, true),
  ('Tratamientos avanzados', 3, 'Evaluación armonización', '30 min', 3000, 2, true),
  ('Tratamientos avanzados', 3, 'Tratamientos avanzados & exclusivos MB', '50 min', 5500, 3, true),
  ('Tratamientos avanzados', 3, 'Cauterización de verrugas', '1 h', 7000, 4, true),
  ('Tratamientos avanzados', 3, 'Botox', '45 min', 18000, 5, true),
  ('Tratamientos avanzados', 3, 'Dermapen', '50 min', 5500, 6, true),
  ('Tratamientos avanzados', 3, 'Mesojet-gun', '50 min', 4500, 7, true),

  -- Láser NDYAG
  ('Láser NDYAG', 4, 'NDYAG evaluación + primera cita', '50 min', 3000, 1, true),
  ('Láser NDYAG', 4, 'Hollywood peel NDYAG', '50 min', 7500, 2, true),
  ('Láser NDYAG', 4, 'NDYAG melasma', '50 min', 12500, 3, true),
  ('Láser NDYAG', 4, 'Remoción de tatuaje', '50 min', 18000, 4, true),
  ('Láser NDYAG', 4, 'NDYAG cicatrices', '50 min', 12500, 5, true),
  ('Láser NDYAG', 4, 'Remoción de cejas', '50 min', 5000, 6, true),
  ('Láser NDYAG', 4, 'Blanqueamiento corporal láser', '50 min', 10800, 7, true),

  -- Corporal
  ('Corporal', 5, 'Blanqueamiento corporal + evaluación', '50 min', 3000, 1, true),
  ('Corporal', 5, 'Mesoterapia capilar/facial', '50 min', 4800, 2, true),
  ('Corporal', 5, 'Cita para blanqueamiento (seguimiento)', '50 min', 3000, 3, true),
  ('Corporal', 5, 'Cita depilación láser', '50 min', 2500, 4, true),
  ('Corporal', 5, 'Masajes', '50 min', 2800, 5, true),
  ('Corporal', 5, 'Remoción de tatuaje', '50 min', 18000, 6, true),
  ('Corporal', 5, 'NDYAG cicatrices', '50 min', 12500, 7, true),
  ('Corporal', 5, 'Blanqueamiento corporal láser', '50 min', 10800, 8, true),

  -- Depilación láser
  ('Depilación láser', 6, 'Cita depilación láser (diodo frío)', '50 min', 2500, 1, true),

  -- Relajación
  ('Relajación', 7, 'Masajes', '50 min', 2800, 1, true),

  -- Área médica · Dra. Saida Medrano
  ('Área médica · Dra. Saida Medrano', 8, 'Esperma de salmón PDRN', '50 min', 12500, 1, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Botox en axilas', '30 min', 25000, 2, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Evaluación capilar + mesoterapia', '50 min', 4800, 3, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Sueroterapia', '50 min', 6500, 4, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Rinoremodelación', '50 min', 25000, 5, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Plasma rico en plaquetas', '50 min', 8500, 6, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Mesoterapia capilar/facial', '50 min', 4800, 7, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Aumento de labios', '50 min', 15500, 8, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Evaluación armonización', '30 min', 3000, 9, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Botox', '45 min', 18000, 10, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Evaluación pérdida de peso', '30 min', 3000, 11, true),
  ('Área médica · Dra. Saida Medrano', 8, 'Tratamiento Tirzepatide', '30 min', 25000, 12, true);

-- 2) CONTENIDO (textos, contacto, encabezados) ───────────────────────────────
insert into public.contenido (clave, valor) values
  ('home_hero', jsonb_build_object(
    'kicker', 'Beauty by Leela · Estética Avanzada',
    'titulo', jsonb_build_array('Cambiamos vidas', 'y autoestimas'),
    'subtitulo', 'Centro de restauración de piel y autoestima en Santo Domingo, con 8 años de trayectoria.',
    'cta_primario', 'Reservar cita',
    'cta_secundario', 'Ver servicios',
    'imagen_path', 'home/hero.jpg'
  )),
  ('home_santuario', jsonb_build_object(
    'kicker', 'Acerca de',
    'titulo', 'Restauración, sanación y bienestar de la piel',
    'parrafo', 'Somos un centro destinado a la restauración, sanación y bienestar de la piel, que busca recuperar tu autoestima de manera integral y con los mayores estándares del mercado.',
    'lema', 'CAMBIAMOS VIDAS Y AUTOESTIMAS',
    'imagen_path', 'home/espacio.jpg'
  )),
  ('nosotras', jsonb_build_object(
    'kicker', 'Nosotros',
    'titulo', 'Beauty by Leela',
    'historia', jsonb_build_array(
      'Somos un centro destinado a la restauración, sanación y bienestar de la piel, que busca recuperar la autoestima de manera integral y con los mayores estándares del mercado.',
      'Nuestro lema lo dice todo: cambiamos vidas y autoestimas. Cada tratamiento se realiza con cuidado, criterio y resultados reales.'
    ),
    'foto_path', 'nosotras/marianny.jpg'
  )),
  ('medico', jsonb_build_object(
    'activo', true,
    'nombre', 'Dra. Saida Medrano',
    'credenciales', 'Directora médica',
    'bio', 'Respalda el área médica de la clínica: armonización, mesoterapia capilar, sueroterapia y procedimientos que requieren criterio clínico, con seguridad y evidencia.',
    'foto_path', 'medico/saida-medrano.jpg'
  )),
  ('servicios_intro', jsonb_build_object(
    'kicker', 'Servicios',
    'titulo', 'Nuestros servicios y precios'
  )),
  ('galeria_intro', jsonb_build_object(
    'kicker', 'Galería',
    'titulo', 'Resultados reales'
  )),
  ('resenas_intro', jsonb_build_object(
    'kicker', 'Reseñas',
    'titulo', 'Lo que dicen nuestras pacientes'
  )),
  ('home_transformaciones', jsonb_build_object(
    'kicker', 'Galería',
    'titulo', 'Resultados que hablan por sí solos',
    'cta_texto', 'Ver galería'
  )),
  ('contacto_info', jsonb_build_object(
    'kicker', 'Contacto',
    'titulo', 'Hablemos de tu piel',
    'intro', 'Escríbenos o reserva en línea. Con gusto te orientamos.',
    'direccion', 'Calle 3ra Lateral A, Sector Dominicanos Ausentes, 2do Nivel #2 (al lado de Metaldom). Santo Domingo, Distrito Nacional.',
    'horario', jsonb_build_array(
      'Martes a jueves: 9:30 a.m. – 5:00 p.m.',
      'Viernes: 9:30 a.m. – 3:30 p.m.',
      'Sábado: 8:30 a.m. – 3:00 p.m.',
      'Domingo y lunes: cerrado'
    ),
    'whatsapp', '8297780482',
    'correo', 'estetica@beautybyleela.com',
    'nota', 'Al agendar, escribe al WhatsApp con tu código de reserva para confirmar. Pacientes nuevos: depósito de RD$ 1,000 para confirmar la cita. Puedes cancelar o reprogramar hasta 1 semana antes.'
  )),
  ('agendar_aviso', jsonb_build_object(
    'titulo', 'Cómo reservar',
    'puntos', jsonb_build_array(
      'Reserva en línea en la agenda y elige tu servicio.',
      'Escribe al WhatsApp con tu código de reserva para confirmar.',
      'Si eres paciente nueva, deja un depósito de RD$ 1,000 para confirmar.',
      'Puedes cancelar o reprogramar hasta 1 semana antes de tu cita.'
    ),
    'nota', 'La primera cita incluye evaluación con el equipo.',
    'cta_texto', 'Reservar cita'
  ))
on conflict (clave) do update set valor = excluded.valor, updated_at = now();

-- 3) EQUIPO (especialistas) ──────────────────────────────────────────────────
insert into public.especialistas (nombre, especialidad, anios, bio, foto_path, orden, publicado)
select * from (values
  ('Marianny Belén', 'CEO · Cosmetóloga', 8, '¡La gurú del acné! Beauty expert sanando pieles y autoestimas desde hace 8 años.', 'especialistas/marianny.jpg', 0, true),
  ('Ámbar González', 'Cosmetóloga integral', null::int, 'Cosmetóloga certificada UNPHU, experta en acné y blanqueamientos corporales, apasionada por la belleza.', 'especialistas/ambar.jpg', 1, true),
  ('Dra. Saida Medrano', 'Directora médica', null::int, 'Área médica de la clínica: armonización, mesoterapia capilar, sueroterapia y más.', 'medico/saida-medrano.jpg', 2, true)
) as v(nombre, especialidad, anios, bio, foto_path, orden, publicado)
where not exists (
  select 1 from public.especialistas e where e.nombre = v.nombre and e.deleted_at is null
);
