/**
 * Lógica del Diagnóstico de Piel (estructural). El texto de marca (título,
 * intro, cierre) es editable desde Supabase; las preguntas y el mapeo viven
 * aquí porque son la lógica del producto, no contenido de marketing.
 *
 * Cada respuesta alimenta una columna de `leads_diagnostico`. NO se guarda
 * ningún dato personal salvo que la persona pida contacto y dé su
 * consentimiento (Ley 172-13).
 */

export type RespuestasQuiz = {
  tipo_piel: string;
  segmento: string; // preocupación principal
  antiguedad: string;
  intento_previo: string;
  urgencia: string;
  busca_formacion: string; // "si" | "no"
};

export type Pregunta = {
  id: keyof RespuestasQuiz;
  titulo: string;
  opciones: { valor: string; etiqueta: string }[];
};

export const PREGUNTAS: Pregunta[] = [
  {
    id: "tipo_piel",
    titulo: "¿Cómo sientes tu piel normalmente?",
    opciones: [
      { valor: "seca", etiqueta: "Seca o tirante" },
      { valor: "grasa", etiqueta: "Grasa o con brillo" },
      { valor: "mixta", etiqueta: "Mixta" },
      { valor: "sensible", etiqueta: "Sensible o reactiva" },
      { valor: "no_segura", etiqueta: "No estoy segura" },
    ],
  },
  {
    id: "segmento",
    titulo: "¿Cuál es tu principal preocupación?",
    opciones: [
      { valor: "manchas", etiqueta: "Manchas o tono desigual" },
      { valor: "acne", etiqueta: "Acné o marcas" },
      { valor: "flacidez", etiqueta: "Flacidez o líneas de expresión" },
      { valor: "textura", etiqueta: "Textura y poros" },
      { valor: "luminosidad", etiqueta: "Falta de luminosidad" },
    ],
  },
  {
    id: "antiguedad",
    titulo: "¿Desde hace cuánto lo notas?",
    opciones: [
      { valor: "reciente", etiqueta: "Hace poco" },
      { valor: "meses", etiqueta: "Algunos meses" },
      { valor: "mas_de_un_ano", etiqueta: "Más de un año" },
      { valor: "siempre", etiqueta: "Desde siempre" },
    ],
  },
  {
    id: "intento_previo",
    titulo: "¿Has intentado tratarlo antes?",
    opciones: [
      { valor: "primera_vez", etiqueta: "No, es mi primera vez" },
      { valor: "casa", etiqueta: "Con productos en casa" },
      { valor: "otra_clinica", etiqueta: "En otra clínica o spa" },
      { valor: "medico", etiqueta: "Con procedimientos médicos" },
    ],
  },
  {
    id: "urgencia",
    titulo: "¿Para cuándo te gustaría ver resultados?",
    opciones: [
      { valor: "evento", etiqueta: "Tengo un evento pronto" },
      { valor: "meses", etiqueta: "En los próximos meses" },
      { valor: "sin_prisa", etiqueta: "Sin prisa, quiero hacerlo bien" },
    ],
  },
  {
    id: "busca_formacion",
    titulo: "¿Te interesa además formarte en estética profesional?",
    opciones: [
      { valor: "no", etiqueta: "No, solo busco tratarme" },
      { valor: "si", etiqueta: "Sí, me interesa la formación" },
    ],
  },
];

const FOCO: Record<string, string> = {
  manchas: "Manchas y luminosidad",
  acne: "Acné y cicatrices",
  flacidez: "Firmeza y líneas de expresión",
  textura: "Renovación de textura y poros",
  luminosidad: "Luminosidad y frescura",
};

const TIPO_PIEL_TEXTO: Record<string, string> = {
  seca: "piel seca",
  grasa: "piel grasa",
  mixta: "piel mixta",
  sensible: "piel sensible",
  no_segura: "piel por determinar",
};

/** Etiqueta del foco recomendado (se guarda en `protocolo_sugerido`). */
export function focoRecomendado(r: RespuestasQuiz): string {
  return FOCO[r.segmento] ?? "Evaluación general de la piel";
}

/** Frase de perfil para mostrar en el resultado. */
export function perfilTexto(r: RespuestasQuiz): string {
  const piel = TIPO_PIEL_TEXTO[r.tipo_piel] ?? "tu piel";
  return `Tu perfil apunta a ${piel} con foco en ${focoRecomendado(
    r
  ).toLowerCase()}.`;
}

/** Valida que estén todas las respuestas (para el server action). */
export function respuestasCompletas(r: Partial<RespuestasQuiz>): r is RespuestasQuiz {
  return PREGUNTAS.every((p) => Boolean(r[p.id]));
}
