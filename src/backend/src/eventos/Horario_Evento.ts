import type { HorarioDTO } from './Eventos_Dto';

export abstract class HorarioEvento {
  abstract readonly tipo: 'RANGO' | 'RECURRENTE';
  abstract esValido(): boolean;
  abstract estaVigente(ahora: Date): boolean;
  abstract coincideConRango(inicio: Date, fin: Date): boolean;
  abstract aDTO(): HorarioDTO;
}
