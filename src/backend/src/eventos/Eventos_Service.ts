import { Injectable } from '@nestjs/common';
import { IRepositorioDeEventos } from './Eventos_Repository';
import { IProveedorEventosExternos } from './Proveedor_Eventos_Externos';
import type { FiltroEventosDTO, ResultadoConsultaDTO } from './Eventos_Dto';

@Injectable()
export class ConsultadorEventos {
  constructor(
    private readonly repositorio: IRepositorioDeEventos,
    private readonly proveedorExterno: IProveedorEventosExternos,
    // T05 define cómo se inyecta el reloj (token) al registrar este provider.
  ) {}

  consultarEventos(_filtro: FiltroEventosDTO): Promise<ResultadoConsultaDTO> {
    throw new Error('No implementado (T05)');
  }
}
