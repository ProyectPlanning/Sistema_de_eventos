import type { HorarioDTO } from './Eventos_Dto';
import { HorarioEvento } from './Horario_Evento';

export class HorarioRango extends HorarioEvento {
  readonly tipo = 'RANGO' as const;

  constructor(
    readonly inicio: Date,
    readonly fin: Date,
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
    throw new Error('No implementado (T13)');
  }

  aDTO(): HorarioDTO {
    throw new Error('No implementado (T07)');
  }
}
