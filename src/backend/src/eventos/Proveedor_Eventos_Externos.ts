import type { Evento } from './Eventos_Entity';
import type { FiltroEventosDTO } from './Eventos_Dto';

export abstract class IProveedorEventosExternos {
  abstract obtenerEventosExternos(filtro: FiltroEventosDTO): Promise<Evento[]>;
}
