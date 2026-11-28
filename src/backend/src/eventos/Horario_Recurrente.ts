import type { DiaSemana, HorarioDTO } from './Eventos_Dto';
import { HorarioEvento } from './Horario_Evento';

export class HorarioRecurrente extends HorarioEvento {
  readonly tipo = 'RECURRENTE' as const;

  constructor(
    readonly diasSemana: DiaSemana[],
    readonly horaInicio: string,
    readonly horaFin: string,
    readonly fechaLimite: string,
  ) {
    super();
  }

  esValido(): boolean {
    throw new Error('No implementado (T07)');
  }

  estaVigente(_ahora: Date): boolean {
    throw new Error('No implementado (T07)');
  }

  coincideConRango(_inicio: Date, _fin: Date): boolean {
    throw new Error('No implementado (T14)');
  }

  aDTO(): HorarioDTO {
    throw new Error('No implementado (T07)');
  }
}
