import { Module } from '@nestjs/common';
import { DatabaseService } from './core/Database_Service';
import { HealthController } from './core/Health_Controller';
import { EventosModule } from './eventos/Eventos_Module';

@Module({
  imports: [EventosModule],
  controllers: [HealthController],
  providers: [DatabaseService],
})
export class AppModule { }
