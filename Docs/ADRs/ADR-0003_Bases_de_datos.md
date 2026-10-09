# ADR-0003: Usar PostgreSQL para la base de datos 
<!-- docs/adr/0003-postgresql-principal-redis-cache.md -->

## Autores:

- Justin David Vargas Vasquez
- Cristian Andrés Díaz Ortega 

## Contexto

La plataforma maneja datos relacionados entre si, como lo son: usuarios, actividades, proveedores, reservas, pagos y disponibilidad. 
Las reservas y los pagos requieren transacciones ACID (Atomicidad, Consistencia, Isolación, Durabilidad) porque se debe evitar los fallos parciales, ya que tiene consecuencias financieras directas. Además el filtro por ubicación 
es un requisito del producto, lo que implica consultas geográficas (profundizar). Se necesita también almacenar atributos flexibles de actividades (horarios variables, precios dinámicos, metadatos de proveedores) 
sin migraciones constantes. La carga esperada en MVP (Producto Mínimo Viable) es moderada; se prioriza consistencia sobre escalabilidad horizontal masiva.

## Decisión

Vamos a usar PostgreSQL, con extensión PostGIS para consultas geográficas y JSONB para atributos flexibles.

## Alternativas consideradas:

- MongoDB: Flexibilidad de esquema que acelera el prototipado, pero transacciones multi-documento más costosas y riesgo de inconsistencias en reservas y pagos. Migrar de MongoDB a PostgreSQL después es costoso.

- DynamoDB: Serverless y auto-escalable, pero consultas complejas limitadas, sin JOINs y con vendor lock-in fuerte con AWS. Mal encaje para reportes y analítica temprana. 

- MySQL / MariaDB: Válidos, pero sin PostGIS nativo y con JSONB menos maduro.

- SQLite: Descartado por falta de concurrencia y capacidades de red para un servicio multiusuario.

- Cassandra / ScyllaDB: Sobredimensionados para la carga esperada; sin transacciones ACID cómodas.

## Consecuencias

### Positivas:

- ACID garantizado en reservas y pagos; no negociable para una plataforma transaccional.

- PostGIS habilita filtros por cercanía y rutas sin servicios externos.

- JSONB permite flexibilidad sin renunciar al modelo relacional.

- PostgreSQL es el estándar de facto del mercado, facilitando contratación y comunidad.

### Negativas / costos aceptados:

- Escalabilidad horizontal limitada: crecer más allá de una instancia requiere sharding manual o Citus. Se acepta como deuda consciente para el MVP.

- Rendimiento en escritura inferior a bases NoSQL para cargas masivas; no relevante para el volumen proyectado.
