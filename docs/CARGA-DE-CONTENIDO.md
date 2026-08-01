# Carga de contenido — Beauty by Leela

Guía para cargar el contenido a mano por el **Table Editor** de Supabase sin
romper ninguna sección. Todo lo que aparece en el sitio sale de estas tablas;
mientras estén vacías, cada sección muestra su estado vacío premium.

---

## 0. Cómo escribir cada tipo de dato en el Table Editor

Antes de pegar nada, hay tres formatos distintos y **no se escriben igual**:

| Tipo de columna | Dónde aparece | Cómo se escribe |
| :--- | :--- | :--- |
| `jsonb` (columna `valor` de `contenido`) | Todo el contenido de textos | **JSON crudo, sin escapar.** Abre la celda `valor`, se despliega un editor JSON y pegas el objeto tal cual: `{ "clave": "valor" }`. Supabase valida el JSON al guardar. |
| `text[]` (columna `incluye`, `no_incluye`) | Solo en la tabla `protocolos` | **Arreglo de Postgres**, no JSON. Usa el editor de arreglo de la celda (botón **+** por cada elemento) o escribe el literal `{"Primer ítem","Segundo ítem"}` — llaves, elementos entre comillas dobles, separados por coma. |
| `numeric(14,2)` (`inversion_min`, `inversion_max`) | Precios | Número plano, sin `RD$` ni comas: `8500` o `8500.00`. |
| `text`, `int`, `boolean` | El resto | Valor directo. `boolean` = `true` / `false`. |

### Tu pregunta directa: ¿el `valor` de `contenido` necesita escape?

**No.** La columna `valor` es `jsonb`. En el editor de la celda pegas el JSON
**tal cual** — comillas dobles normales, sin barras invertidas, sin envolverlo
en comillas. Las únicas reglas son las de JSON válido:

- Comillas **dobles** siempre (`"así"`, nunca `'así'`).
- **Sin coma final** después del último elemento (el error más común).
- Los arreglos dentro del JSON (como `historia` o `puntos`) van con corchetes
  `[ ]` — eso es JSON, distinto del `text[]` de `incluye`.

> Consejo: si una sección no carga después de pegar, casi siempre es una coma de
> más o una comilla curva copiada desde Word. Pega el JSON en un validador
> rápido si tienes duda.

---

## 1. Tabla `contenido` — plantillas JSON listas para pegar

Una fila por `clave`. En cada fila: escribe la `clave` en su columna, y pega el
bloque JSON completo en la columna `valor`. Los valores de ejemplo son
realistas: reemplaza el texto, conserva la estructura.

### `clave = nosotras`
```json
{
  "kicker": "Nosotras",
  "titulo": "Marianny Belén",
  "historia": [
    "Beauty by Leela nació de una obsesión sencilla: que cada mujer que se sienta frente al espejo se reconozca, descansada y en paz con su piel.",
    "Marianny se formó en estética avanzada y lleva más de ocho años acompañando procesos reales — no promesas, sino piel que mejora sesión tras sesión.",
    "Hoy dirige un equipo de especialistas y un espacio pensado como santuario, donde la ciencia de la piel se encuentra con el cuidado humano."
  ],
  "foto_path": "nosotras/marianny.jpg"
}
```

### `clave = medico`
```json
{
  "activo": true,
  "nombre": "Dra. Saida Medrano",
  "credenciales": "Médico especialista · Exp. XXXX-XX",
  "bio": "Supervisa el área médica de la clínica y respalda los protocolos que requieren criterio clínico, garantizando que cada procedimiento se realice con seguridad y evidencia.",
  "foto_path": "medico/saida-medrano.jpg"
}
```
> Mientras no tengas las credenciales confirmadas, pon `"activo": false` y la
> sección mostrará el estado "en preparación" en lugar de datos a medias.

### `clave = nosotras_espacio`
```json
{
  "kicker": "El santuario",
  "titulo": "Un espacio pensado para bajar el ritmo",
  "parrafo": "Cada detalle del espacio está cuidado para que tu cita se sienta como una pausa: luz cálida, silencio y el tiempo suficiente para atenderte sin prisa.",
  "lema": "Tu piel merece tiempo.",
  "imagen_path": "nosotras/espacio.jpg"
}
```

### `clave = protocolos_intro`
```json
{
  "kicker": "Protocolos",
  "titulo": "Procesos con inversión transparente"
}
```

### `clave = agendar_aviso`
```json
{
  "titulo": "Cómo es tu primera cita",
  "puntos": [
    "Tu primera cita es una evaluación de RD$ 3,000, realizada por Marianny.",
    "Para reservar dejas un depósito de RD$ 1,000 que se descuenta de tu tratamiento.",
    "Recibes la confirmación por WhatsApp con el código de tu cita.",
    "Tu plan exacto se define contigo durante la evaluación."
  ],
  "nota": "Si necesitas reagendar, escríbenos con al menos 24 horas de anticipación.",
  "cta_texto": "Agendar mi evaluación"
}
```

### `clave = primera_cita`
```json
{
  "monto_texto": "RD$ 3,000",
  "equivalente": "≈ US$ 50",
  "nota": "El plan y la inversión exacta se definen contigo en la evaluación."
}
```

---

## 2. Tablas normales — filas de ejemplo

### `especialistas` (una fila = una especialista)

| Columna | Valor de ejemplo | Notas |
| :--- | :--- | :--- |
| `nombre` | `Marianny Belén` | obligatorio |
| `especialidad` | `Estética avanzada` | opcional |
| `anios` | `8` | entero, opcional (se muestra "8 años") |
| `bio` | `Fundadora y especialista principal.` | opcional |
| `foto_path` | `especialistas/marianny.jpg` | ruta dentro del bucket `publico` |
| `orden` | `0` | menor = aparece primero |
| `publicado` | `true` | **si es `false`, no sale en el sitio** |
| `deleted_at` | *(vacío / null)* | déjalo vacío |

### `protocolos` (una fila = un protocolo)

| Columna | Valor de ejemplo | Notas |
| :--- | :--- | :--- |
| `slug` | `renovacion-luminosa` | único, sin espacios ni tildes, con guiones. Es la URL: `/protocolos/renovacion-luminosa` |
| `nombre` | `Renovación Luminosa` | obligatorio |
| `descripcion` | `Protocolo por fases para recuperar luminosidad y textura uniforme.` | opcional |
| `para_quien` | `Para pieles apagadas o con daño solar.` | opcional |
| `duracion_texto` | `4 sesiones · 6 a 8 semanas` | texto libre |
| `incluye` | `{"Evaluación con Marianny","Limpieza profunda","Peeling progresivo","Protocolo domiciliario"}` | **`text[]`** — literal con llaves, ver sección 0 |
| `no_incluye` | `{"Productos para llevar a casa","Procedimientos médicos"}` | **`text[]`** |
| `inversion_min` | `8500` | número plano (`numeric`) |
| `inversion_max` | `22000` | número plano; si dejas ambos, se muestra un rango |
| `imagen_path` | `protocolos/renovacion-luminosa.jpg` | ruta en el bucket |
| `orden` | `0` | menor = primero |
| `publicado` | `true` | **`false` = oculto** |
| `deleted_at` | *(vacío)* | |

> **Principales vs. complementarios:** un protocolo aparece como *principal*
> (tarjeta grande con detalle de fases) **si tiene al menos una fila en
> `fases_protocolo`**. Si no tiene fases, cae automáticamente en *Servicios
> complementarios* (lista compacta). No hay un campo que lo marque: lo decide la
> existencia de fases.

### `fases_protocolo` (varias filas = las fases de UN protocolo)

Cómo se enlazan: cada fase apunta al protocolo por `protocolo_id` (el `id` UUID
de la fila del protocolo, que copias desde la tabla `protocolos`). Ejemplo de
tres fases del mismo protocolo:

| `protocolo_id` | `numero` | `nombre` | `descripcion` | `duracion_texto` | `orden` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<uuid del protocolo>` | `1` | `Diagnóstico y preparación` | `Evaluamos tu piel y preparamos la barrera antes de intervenir.` | `Semana 1` | `1` |
| `<uuid del protocolo>` | `2` | `Renovación` | `Peeling progresivo midiendo la respuesta de tu piel.` | `Semana 3` | `2` |
| `<uuid del protocolo>` | `3` | `Sellado y mantenimiento` | `Consolidamos resultados y definimos tu rutina en casa.` | `Semana 6` | `3` |

- `numero` es el número visible de la fase (01, 02…).
- `orden` controla el orden de aparición (usa el mismo valor que `numero` para
  no complicarte).
- El mismo `protocolo_id` en las tres filas es lo que las agrupa bajo ese
  protocolo. Déjà `deleted_at` vacío.

---

## 3. Bucket `publico` — estructura de carpetas e imágenes

Todos los `*_path` son rutas **relativas al bucket `publico`**. Sube las
imágenes con esta estructura para no reacomodar después:

```
publico/
├── nosotras/
│   ├── marianny.jpg        → contenido.nosotras.foto_path
│   └── espacio.jpg         → contenido.nosotras_espacio.imagen_path
├── medico/
│   └── saida-medrano.jpg   → contenido.medico.foto_path
├── especialistas/
│   ├── marianny.jpg        → especialistas.foto_path
│   └── <nombre>.jpg
├── protocolos/
│   └── <slug>.jpg          → protocolos.imagen_path
└── casos/
    ├── <slug>-antes.jpg    → casos.imagen_antes_path
    └── <slug>-despues.jpg  → casos.imagen_despues_path
```

En la base guardas la ruta **sin** el nombre del bucket: por ejemplo
`nosotras/marianny.jpg` (no `publico/nosotras/marianny.jpg`).

### Formato y tamaño — importante para el LCP

El sitio usa el optimizador de `next/image`, que **reconvierte a WebP/AVIF** y
genera tamaños responsivos automáticamente. Aun así, la imagen de origen manda:
si subes una foto de 8 MB del celular, el optimizador tarda más y el LCP sufre.

Recomendación al subir:

| Uso | Ancho máximo | Peso objetivo |
| :--- | :--- | :--- |
| Retrato Marianny / hero de protocolo | **1600 px** | **≤ 300 KB** |
| Foto de especialista / caso antes-después | **1200 px** | ≤ 250 KB |
| Foto redonda del área médica | **800 px** | ≤ 150 KB |

- **Formato de origen:** JPEG de buena calidad (75–82) o WebP. No hace falta que
  subas WebP — el sitio ya sirve WebP/AVIF; un JPEG bien comprimido es perfecto.
- **Antes de subir:** redimensiona al ancho de la tabla y comprime. Nunca subas
  el archivo original del teléfono sin tocar.
- Las fotos de retrato quedan mejor en vertical (relación ~4:5).

> Con imágenes bien dimensionadas, la página de detalle carga el hero como
> elemento LCP de inmediato; con un archivo pesado, ese mismo LCP se dispara.
> Este único paso es lo que más protege el rendimiento del sitio.
