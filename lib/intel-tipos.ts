/**
 * Tipos y helpers PUROS de inteligencia — sin dependencias de servidor, para
 * poder importarse desde componentes de cliente (el panel).
 */

export type Resumen = {
  sesiones: number;
  vistas: number;
  msProm: number;
  movil: number;
  escritorio: number;
  sesionesPrevias: number;
};
export type GeoRow = { pais: string; region: string; ciudad: string; sesiones: number };
export type ClickRow = { path: string; disp: string; gx: number; gy: number; clase: string; conteo: number };
export type ScrollRow = { path: string; disp: string; depth: number; sesiones: number };
export type SeccionRow = { path: string; seccion: string; msProm: number };
export type FrustRow = { path: string; tipo: string; seccion: string; conteo: number };
export type EmbudoRow = { paso: string; sesiones: number };
export type RecorridoRow = { ruta: string; conteo: number };

export type Inteligencia = {
  hayDatos: boolean;
  resumen: Resumen;
  geo: GeoRow[];
  clicks: ClickRow[];
  scroll: ScrollRow[];
  secciones: SeccionRow[];
  frustracion: FrustRow[];
  embudo: EmbudoRow[];
  recorridos: { top: RecorridoRow[]; noConvirtieron: RecorridoRow[] };
  paths: string[];
};

const PASO_LABEL: Record<string, string> = {
  "1_visita": "Visita",
  "2_protocolos": "Ve protocolos",
  "3_inicia_diagnostico": "Empieza diagnóstico",
  "4_termina_diagnostico": "Termina diagnóstico",
  "5_deja_contacto": "Deja contacto",
  "6_agendar": "Clic en agendar",
};
export function pasoLabel(paso: string): string {
  return PASO_LABEL[paso] ?? paso;
}

export function frustracionTexto(f: FrustRow): { texto: string; sugerencia: string } {
  const donde = f.seccion ? `“${f.seccion}” (${f.path})` : f.path;
  const n = f.conteo;
  switch (f.tipo) {
    case "muerto":
      return {
        texto: `${n} ${n === 1 ? "persona hizo" : "personas hicieron"} clic en algo que no abre nada en ${donde}.`,
        sugerencia: "Ese elemento parece un botón pero no lo es. Hazlo clickeable, o quítale la apariencia de botón.",
      };
    case "rabia":
      return {
        texto: `${n} ${n === 1 ? "persona hizo" : "personas hicieron"} varios clics seguidos en ${donde} — algo no respondía.`,
        sugerencia: "Revisa que ahí no haya un botón lento, roto o un enlace que tarda en cargar.",
      };
    case "retroceso":
      return {
        texto: `${n} ${n === 1 ? "persona salió" : "personas salieron"} de ${f.path} en menos de 3 segundos.`,
        sugerencia: "La página no cumple lo que promete el enlace que la trajo. Revisa el título y la primera imagen.",
      };
    case "erratico":
      return {
        texto: `${n} ${n === 1 ? "persona buscaba" : "personas buscaban"} algo subiendo y bajando en ${f.path}.`,
        sugerencia: "Puede que no encuentren lo que buscan. Revisa la jerarquía de la página o agrega accesos directos.",
      };
    default:
      return { texto: `${n} señales en ${donde}.`, sugerencia: "" };
  }
}
