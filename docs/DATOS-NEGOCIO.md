# Beauty by Leela — Datos reales del negocio (referencia de construcción)

> Fuente: agenda oficial de Setmore (verificado). Este archivo es **referencia
> para construir** — el contenido y los precios **vivos** viven en Supabase
> (tabla `contenido`, `protocolos`, `fases_protocolo`, etc.), que la clienta
> edita. No hardcodear precios en componentes.

## Operativo
- **Horario:** Mar–Jue 9:30–17:00 · Vie 9:30–15:30 · Sáb 8:30–15:00 · Dom/Lun cerrado. (Atlántico)
- **Dirección oficial (Setmore):** Calle 3ra Lateral A, Sector Dominicanos Ausentes, 2do Nivel #2 (al lado de Metaldom), Santo Domingo, D.N.
  - ⚠️ El pin de Google Business apunta a otro lugar → lo corrige la clienta. No montar Schema/mapa hasta confirmar coordenadas (Tanda 13).
- **Contacto:** +1 829 778 0482 · estetica@beautybyleela.com
- **Reseñas:** 5.0 · 130 en Setmore.

## CTA principal del sitio — la puerta de entrada
**PRIMERA CITA + EVALUACIÓN — RD$3,000 (US$50) · 50 min · la realiza Marianny.**
Es el CTA #1 de todo el sitio; lo demás es secundario. En **cada** punto que mande a agendar, el copy debe decir de entrada:
1. Primera cita RD$3,000 (o US$50).
2. Se confirma con **RD$1,000 por adelantado**.
3. La evalúa Marianny personalmente.
4. Qué incluye (limpieza básica + asesoría + rutina en casa).

## Reserva actual (Setmore) = mayor fuga de dinero
Hoy reservar = 4 pasos en 3 plataformas (elegir en Setmore → WhatsApp con código → depósito RD$1,000 → esperar confirmación). El sitio **no elimina** el depósito, pero **lo explica antes** y **acompaña paso a paso** (Tanda 11 /agendar) para que nadie abandone por confusión.

## Protocolos = fases, no servicios sueltos
Ella ya vende procesos, sin nombrarlos: **Acné #1 → #2 → #3**, **Manchas #1 → #2**. Los protocolos del sitio se arman **agrupando servicios en recorridos con fases** (tabla `protocolos` + `fases_protocolo`), no listando servicios uno por uno.

## Reglas de precio y copy
- **RD$ siempre**, formato dominicano. US$ solo en la primera cita (donde ella lo hace).
- Donde ella da **rango** ("depende de zona", "revisar catálogo") → publicar **desde–hasta**, no inventar número cerrado (usar `inversion_min`/`inversion_max`).
- **Medicina estética** (botox, rellenos, Tirzepatide, PDRN): sin promesas de resultado; mencionar que requieren **evaluación médica previa**.
- **Dra. Saida Medrano** (medicina estética + tricología "Evaluación capilar + mesoterapia" RD$4,800): confirmar con la clienta cómo presentarla y con qué credenciales antes de nombrarla.
- **No listar "Visitadores"** (cita de 15 min para laboratorios) en el sitio público.

## Catálogo de referencia (precios RD$; los vivos van en Supabase)
- **Faciales seguimiento:** básico 2,500 · profundo seca/grasa/mixta 2,500–2,800 · hidratante/madura 3,000 · Acné #1 3,800 · #2 4,000 · #3 4,500 · Manchas #1 4,000 · #2 4,500 · blanqueador 4,800.
- **Faciales individuales:** Especial Jueves 2,000 · hidratación 3,000 · peeling acné 3,800 · dermaplaning 4,500 · Casmara 4,500 · dermapen 5,500 · PDRN c/dermapen 8,500 · PDRN mesoterapia 12,500.
- **Avanzados:** eval. armonización 3,000 · mesojet-gun 4,500 · cauterización verrugas 4,800–7,000 · exclusivos MB 3,000–14,000 · botox 18,000.
- **Láser NDYAG:** eval+1ra 3,000 · cejas 5,000 · Hollywood peel 7,500 · blanqueam. corporal 10,800 (variable) · melasma 12,500 · cicatrices 12,500 · tatuaje 18,000.
- **Depilación diodo frío:** zonas pequeñas 1,500 · grandes 2,000 · cita 2,500 (paquetes en WhatsApp).
- **Masajes (aromaterapia):** cráneo-facial 2,000 · piernas 2,300 · espalda 2,800 · holístico 3,000.
- **Corporal/blanqueamiento:** +evaluación 3,000 · seguimiento 3,000 (por área en WhatsApp).
- **Dra. Medrano:** eval. armonización/peso 3,000 · mesoterapia capilar/facial 4,800 · eval capilar+meso 4,800 · sueroterapia 6,500 · PRP 8,500 · PDRN 12,500 · labios 15,500 · botox 18,000 · botox axilas 25,000 · rinoremodelación 25,000 · Tirzepatide 25,000.
