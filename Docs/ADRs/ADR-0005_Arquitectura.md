# ADR-0005: Arquitectura por Capas
<!-- docs/adr/0005-arquitectura-por-capas.md -->

## Autores:

- Justin David Vargas Vasquez
- Cristian Andrés Díaz Ortega

## Contexto
Cuando el software está en fase de definición y validación. La plataforma tiene dominios claramente distinguibles como lo son actividades, reservas, proveedores, usuarios, pagos, notificaciones, 
que en el futuro exista la posibilidad de escalar de forma independiente. Aunque, no hay evidencia aún de cuellos de botella reales y adoptar arquitecturas distribuidas en un MVP multiplica costos operativos 
y cognitivos. La investigación sobre equipos que adoptaron microservicios prematuramente documenta incrementos de recursos del doble o triple sin valor proporcional, y casos de migración inversa con reducciones de recursos.

## Decisión

Vamos a construir la plataforma bajo una Arquitectura por Capas, organizando el sistema de forma horizontal en capas de Presentación (API/Controladores), Lógica de Negocio (Servicios) y 
Acceso a Datos (Repositorios/Entidades). Dentro de la capa de negocio, la lógica se agrupará de manera clara para gestionar las entidades de activities, bookings, providers, users, payments y notifications. 
La comunicación entre la lógica y los datos externos se realiza mediante interfaces y contratos estricto, facilitando que los componentes mantengan una cohesión técnica alta y permitiendo evaluar su migración 
hacia microservicios si la carga o la organización del equipo lo requieren en el futuro.

## Alternativas consideradas

- Microservicios desde el inicio: descartado. 2–3x en infraestructura y complejidad operativa (service discovery, tracing distribuido, consistencia eventual, contratos entre servicios) sin valor demostrado en un
  producto no validado. Además, el equipo tendría que aprender simultáneamente el dominio, las tecnologías y la operación distribuida.

- Serverless (Lambda + API Gateway + DynamoDB): cold starts, límites de ejecución y dificultad para transacciones largas (reserva + pago + notificación + webhook al proveedor). Añade un paradigma nuevo al equipo.
  Descartado para el MVP.

- Event-Driven Architecture pura: ideal para escalar, pero exige manejar consistencia eventual, dead letter queues, idempotencia y trazabilidad distribuida. 

- Arquitectura hexagonal / clean architecture completa: valiosa pero con sobrecarga de abstracciones innecesaria para el tamaño actual del equipo. Se toman prestadas ideas (puertos/adaptadores para proveedores)
  sin adoptar el dogma completo.

## Consecuencias

### Positivas:

- Velocidad de MVP: un repositorio, un pipeline de CI/CD, un despliegue.

- Transacciones ACID módulos: una reserva puede actualizar activities, bookings y payments en una sola transacción.

- Refactorización sencilla: mover código entre módulos es trivial dentro del mismo proceso.

- Camino de extracción claro: los módulos ya están desacoplados a nivel de código y pueden migrarse a servicios sin reescribir lógica.

### Negativas / costos aceptados:

- Escalabilidad vertical limitada: crecer significa más CPU/RAM, no más instancias por servicio.

- Riesgo de acoplamiento: sin disciplina y revisión de código, los módulos pueden entrelazarse. Se requiere gobernanza arquitectónica explícita (reglas de importación, linting de fronteras de módulos).

- Punto único de fallo: la caída del monolito tumba toda la plataforma. Se mitiga con réplicas, health checks y despliegue blue-green.

- Un solo lenguaje/runtime para todo: no se puede elegir la mejor herramienta por dominio (p. ej., Go para el motor de disponibilidad). Se acepta como costo de simplicidad.
