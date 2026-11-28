import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from './Health_Controller';
import type { DatabaseService } from './Database_Service';

describe('HealthController', () => {
  function crearControlador(query: jest.Mock): HealthController {
    return new HealthController({ query } as unknown as DatabaseService);
  }

  it('devuelve database "ok" cuando la consulta resuelve', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [{ version: 'PostgreSQL 16' }] });
    const controlador = crearControlador(query);

    await expect(controlador.check()).resolves.toEqual({
      backend: 'ok',
      database: 'ok',
      version: 'PostgreSQL 16',
    });
    expect(query).toHaveBeenCalledWith('SELECT version() AS version');
  });

  it('lanza ServiceUnavailableException con database "error" cuando la consulta rechaza', async () => {
    const query = jest.fn().mockRejectedValue(new Error('conexión rechazada'));
    const controlador = crearControlador(query);

    const error = await controlador.check().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toEqual({
      backend: 'ok',
      database: 'error',
      detail: 'conexión rechazada',
    });
  });
});
