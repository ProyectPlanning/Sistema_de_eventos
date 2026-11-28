import type { HorarioEvento } from './Horario_Evento';

export class Tarifa {
  constructor(readonly nombre: string, readonly precioCop: number, readonly vigente: boolean) {}
}

export interface EventoProps {
  id: string;
  origen: 'LOCAL' | 'EXTERNO';
  titulo: string;
  descripcion: string;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string | null;
  horario: HorarioEvento;
  tarifas: Tarifa[];
  capacidadMaxima: number | null;
  cuposDisponibles: number | null;
  estado: 'VIGENTE' | 'NO_VIGENTE';
  urlOficial: string | null;
}

export class Evento {
  constructor(readonly props: EventoProps) {}  // T08 agrega las validaciones de invariantes
  tieneCupoDisponible(): boolean { throw new Error('No implementado (T08)'); }
  tarifaMinimaVigente(): number | null { throw new Error('No implementado (T08)'); }
  estaVigente(_ahora: Date): boolean { throw new Error('No implementado (T08)'); }
}
