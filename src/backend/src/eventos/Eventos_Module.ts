import { Module } from '@nestjs/common';

/**
 * true  → las capas que aún no existen (o que dependen de BD/internet) se enlazan a stubs de eventos/stubs/.
 * false → se usan las implementaciones reales.
 * IMPORTANTE: es una FUNCIÓN y se llama dentro de useFactory, nunca al cargar el archivo.
 * main.ts carga .env DESPUÉS de importar AppModule; leer process.env al importar daría siempre undefined fuera de Docker.
 */
export function usarStubs(): boolean {
  return process.env.USAR_STUBS === 'true';
}

// Patrón para T02/T05 (no activar en T01):
// { provide: ConsultadorEventos,
//   useFactory: (...) => (usarStubs() ? new StubConsultadorEventos() : new ConsultadorEventos(...)),
//   inject: [...] }
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class EventosModule {}
