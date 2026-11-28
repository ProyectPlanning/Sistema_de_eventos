export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export type HorarioDTO =
  | { tipo: 'RANGO'; inicio: string; fin: string }               // ISO 8601 con -05:00
  | { tipo: 'RECURRENTE'; diasSemana: DiaSemana[]; horaInicio: string; horaFin: string; fechaLimite: string }; // HH:mm, HH:mm, YYYY-MM-DD

export interface EventoDTO {
  id: string;                      // "LOCAL-12" | "DATOSGOV-a1b2" | "APICOL-45"
  origen: 'LOCAL' | 'EXTERNO';
  titulo: string;
  descripcion: string;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string | null;
  horario: HorarioDTO;
  tarifaMinimaCop: number | null;  // pesos COP (NO centavos); null = "Precio no disponible"
  urlOficial: string | null;
}

export interface ResultadoConsultaDTO {
  eventos: EventoDTO[];
  localesDisponibles: boolean;
  externosDisponibles: boolean;
}

export interface ZonaGeograficaDTO {
  pais?: string;
  departamento?: string;
  ciudad?: string;
}

export interface FiltroEventosDTO {
  zonaGeografica?: ZonaGeograficaDTO;
  presupuestoMaximo?: number;      // pesos COP
  rangoHorario?: { inicio?: Date; fin?: Date };
}
