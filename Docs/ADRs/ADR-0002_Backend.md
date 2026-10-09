# ADR-0002: Usar NestJS + TypeScript como framework de backend
<!-- docs/adr/0002-usar-nestjs-typescript-backend.md -->

## Autores:

- Justin David Vargas Vasquez
- Cristian Andrés Díaz Ortega

## Contexto

El backend debe exponer la lógica de negocio de una plataforma transaccional: catálogo de actividades, disponibilidad, reservas, pagos, integración con proveedores externos y notificaciones.
Las reservas requieren consistencia transaccional (no puede existir una reserva confirmada sin pago registrado). El equipo no conoce la mayoría de las tecnologías del stack, por lo que
frameworks minimalistas representan un riesgo de deuda técnica temprana. Ya se decidió usar TypeScript en el frontend (ver ADR-0001), lo que abre la posibilidad de unificar lenguaje.

## Decisión

Vamos a construir el backend con NestJS sobre Node.js, en TypeScript, aprovechando su arquitectura modular (módulos, controladores, servicios, DTOs) y su sistema de inyección de dependencias.

## Alternativas consideradas

- FastAPI (Python): Mejor rendimiento bruto y curva de aprendizaje inicial más baja, pero carece de estructura opinionada. Para un equipo sin experiencia, la libertad de organización se traduce en deuda técnica (patrones inconsistentes, refactorizaciones tempranas). Además rompe la unificación de lenguaje con el frontend.

- Spring Boot (Java): Muy estructurado y maduro, pero Java con su verbosidad y curva de aprendizaje media-alta ralentiza la entrega del MVP. Menor disponibilidad de talento para startups en el rango de contratación del proyecto.

- Express / Fastify (Node.js): Minimalistas, pero sin estructura impuesta. Se descartan por el mismo motivo que FastAPI.

- Django (Python): Orientado a aplicaciones web con admin y ORM pesado; sobredimensionado para una API-first.

- Go (Gin / Echo): Excelente rendimiento, pero ecosistema más pequeño, menos bibliotecas de terceros y necesidad de aprender un lenguaje nuevo. El costo de aprendizaje no se justifica para la carga esperada.

## Consecuencias

### Positivas:

- Estructura impuesta por el framework: el equipo no debate dónde ubicar la lógica, el framework lo dicta.

- Un solo lenguaje (TypeScript) en frontend y backend.

- Soporte nativo para GraphQL, WebSockets, CQRS y microservicios cuando la plataforma escale.

- Alta demanda de mercado en 2025–2026, lo que facilita contratación futura.

- Integración directa con TypeORM o Prisma para PostgreSQL.

### Negativas / costos aceptados:

- Boilerplate: cada recurso requiere módulo, controlador, servicio y DTOs. Las primeras semanas pueden sentirse lentas.

- Curva de aprendizaje por conceptos Angular-like (decoradores, providers, DI): extraño para quien viene de Express o FastAPI.

- Cold starts altos si en el futuro se despliega en serverless (Lambda); se acepta porque la arquitectura decidida es monolito desplegado en contenedores.

- Rendimiento ligeramente inferior a FastAPI en throughput puro; irrelevante para la carga esperada en MVP.
