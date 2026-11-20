import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Carga las variables de backend/.env si el archivo existe.
try {
  process.loadEnvFile('.env');
} catch {
  // En Docker el archivo no existe (lo excluye .dockerignore):
  // las variables ya vienen del docker-compose.yml.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();