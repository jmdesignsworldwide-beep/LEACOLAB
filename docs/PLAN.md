# Beauty by Leela — Plan de tandas (vigente)

> Reemplaza la sección 9 del Prompt Maestro. Todo lo demás del Maestro y de la
> Dirección de Movimiento sigue vigente sin cambios.

## Reglas estructurales del proyecto
1. **El contenido nunca vive en el código.** De la Tanda 4 en adelante, ninguna foto,
   texto de negocio, precio ni reseña se hardcodea: todo se lee de Supabase, con
   **estado vacío premium** y su campo ya editable en el portal. Si una sección no se
   puede llenar desde el portal, no está terminada.
2. **El portal es el producto**, no un admin genérico: convierte los datos del
   Diagnóstico en **inteligencia de mercado** del nicho de la clienta.
3. **Above-the-fold sin JavaScript:** nada por encima del pliegue depende de JS para
   ser visible (ver README → animación del hero en CSS puro, Tanda 4).
4. **Fort Knox desde la línea uno** (ver protocolo JM Nexus): RLS + FORCE deny-all,
   validación server-side, `audit_log` inmutable, Security Advisor 0/0, PAT temporal.

## Estado
- ✅ **Tanda 0** — Preparación
- ✅ **Tanda 1** — Fundación y sistema de diseño
- ⏳ **Tanda 2** — Supabase y Fort Knox (en curso)

## Plan
| Tanda | Alcance |
|---|---|
| 2 | Supabase: esquema completo, RLS+FORCE, buckets, funciones, pg_cron, bitácora, Security Advisor 0/0 |
| 3 | **Portal** (sube desde la 11): auth 2 roles, CRUD de contenido, analítica sin PII, inteligencia de mercado |
| 4 | Home — hero y santuario (contenido desde Supabase; hero animado en **CSS puro**) |
| 5 | Home — protocolos y transformaciones |
| 6 | Nosotras y equipo |
| 7 | Protocolos con inversión transparente |
| 8 | Transformaciones |
| 9 | Diagnóstico de Piel (capta lead + alimenta inteligencia) |
| 10 | Formación |
| 11 | Contacto, ubicación y agendamiento |
| 12 | SEO local, rendimiento y cierre (retirar noindex, SITE_URL real, heartbeat GitHub Actions) |

## Privacidad — Ley 172-13 (datos personales / salud)
- `leads_diagnostico`, `inscripciones_formacion`, `mensajes_contacto` guardan:
  `consentimiento_contacto` (obligatorio `true`), `consentimiento_fecha`,
  `consentimiento_texto_version`.
- Casilla explícita **no premarcada** en el diagnóstico (Tanda 9) + enlace a `/privacidad`.
- **Derecho de eliminación:** borrado definitivo (no soft-delete) de leads, solo admin,
  registrado en bitácora **sin copiar PII**.
- **Retención:** purga automática de leads no convertidos con +24 meses sin actividad.

## Roles del portal
- **Administradora (Marianny):** todo + gestión de usuarios + bitácora + consentimientos + contacto completo de leads.
- **Editora (asistente):** sube contenido, no borra en definitivo, **no ve** bitácora,
  ni consentimientos, ni el contacto completo de los leads.
