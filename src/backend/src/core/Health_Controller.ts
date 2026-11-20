import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from './Database_Service';

@Controller('health')
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async check() {
    try {
      const result = await this.db.query('SELECT version() AS version');
      return { backend: 'ok', database: 'ok', version: result.rows[0].version };
    } catch (error) {
      throw new ServiceUnavailableException({
        backend: 'ok',
        database: 'error',
        detail: (error as Error).message,
      });
    }
  }
}