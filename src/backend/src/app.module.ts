import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './core/Database_Service';
import { HealthController } from './core/Health_Controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}