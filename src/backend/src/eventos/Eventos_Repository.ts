import type { Evento } from './Eventos_Entity';
import type { ZonaGeograficaDTO } from './Eventos_Dto';

export abstract class IRepositorioDeEventos {
  abstract buscarPorCriterios(zona?: ZonaGeograficaDTO, presupuestoMax?: number): Promise<Evento[]>;
}
