# ADR-0004: Integración de APIs Externas para Eventos, Ubicación y Servicios de Terceros
<!-- docs/decisions/0004-integracion-apis-externas-eventos-colombia.md -->

## Autores:
- Justin David Vargas Vásquez
- Cristian Andrés Díaz Ortega
- Juan Sebastián Rodríguez Carvajal
- Martín Lora Caro
- Nicolás David Lovera Cabiativa

## Estado:
Aceptado (Alineado con la Arquitectura de Software en Capas v1.0 y Alcance de Etapa 1)

---

## Contexto

El sistema de descubrimiento y gestión de eventos requiere nutrir su catálogo con actividades vigentes y validar la coherencia geográfica de las búsquedas de los usuarios (`REQ-01`). Para cumplir con el principio de no construir infraestructura redundante y aprovechar fuentes de datos abiertas y oficiales de Colombia, se ha definido integrar dos APIs externas clave para eventos y datos territoriales:

1. **API de Datos Territoriales y Referencias Nacionales — API Colombia:**
   * **URL:** `https://api-colombia.com/`
   * **Propósito:** Normalización geográfica de búsquedas (país, departamentos, municipios y ciudades de Colombia) y consulta de información de contexto nacional para los filtros de ubicación de `REQ-01`.
   * **Condición de operación y restricción técnica:** Para mantener el servicio estable ante la alta demanda, algunos endpoints tienen un **límite estricto de 60 solicitudes por minuto por dirección IP**. Como los datos de división política y ciudades cambian con muy baja frecuencia, la fuente recomienda explícitamente guardarlos en caché dentro de la aplicación.

2. **API de Catálogo de Eventos Públicos Oficiales — Datos Abiertos Colombia (MinCiencias):**
   * **URL:** `https://www.datos.gov.co/Ciencia-Tecnolog-a-e-Innovaci-n/Eventos-Nacionales-e-Internacionales-de-la-act/xm7a-7paj/about_data`
   * **Propósito:** Ingesta y consulta de eventos públicos reales a nivel nacional e internacional (actividades de Ciencia, Tecnología, Innovación y divulgación cultural) mediante el protocolo REST/SODA API de la plataforma nacional de datos abiertos.

Adicionalmente, en estricta correspondencia con el diagrama maestro de arquitectura (`Arquitectura_de_Software_en_Capas_3.drawio`), el sistema interactúa con otros dos servicios externos de terceros:
3. **API de Google Maps:** Georreferenciación de recintos, cálculo de cercanía y renderizado de mapas.
4. **API de Gmail:** Despacho de correos electrónicos transaccionales (confirmación de registro para `REQ-13` y avisos de seguridad de cuenta).

Dado que los proveedores externos pueden experimentar caídas, latencia de red o variaciones en sus esquemas JSON, se requiere una estrategia arquitectónica que impida que fallos externos bloqueen la operación central de la plataforma.

---

## Decisión

1. **Adopción del Patrón Adapter (Adaptador):**
   Cada API externa se encapsulará detrás de un adaptador específico que implementa una interfaz de dominio interna:
   * `IProveedorEventosExternos` implementado por `AdaptadorEventosDatosGov` (para consumir `datos.gov.co`).
   * `IProveedorGeografico` implementado por `AdaptadorApiColombia` (para consumir `api-colombia.com`).
   * `IServicioCorreo` implementado por `AdaptadorGmail` (para consumir la API de Gmail).
   * `IServicioMapas` implementado por `AdaptadorGoogleMaps` (para geocodificación).

2. **Estrategia de Caché en Memoria para API Colombia:**
   Para respetar rigurosamente la cuota de **60 solicitudes por minuto por IP** y evitar bloqueos (HTTP 429 *Too Many Requests*), la aplicación implementará una capa de caché en memoria (*In-Memory Cache*) para las consultas de atracciones turisticas provenientes de `https://api-colombia.com/`. Los datos se cargarán durante el inicio o en la primera solicitud con un tiempo de expiración prolongado (TTL de 24 horas), eliminando peticiones redundantes.

3. **Mecanismo de Resiliencia (Timeout Estricto y Fallback):**
   Las consultas remotas a la API de eventos de `datos.gov.co` y a la de `https://api-colombia.com/` tendrán un tiempo de espera límite (*timeout*) de **2 segundos**. Si el proveedor externo no responde dentro de dicho tiempo o retorna un error 5xx, el adaptador activa el mecanismo de *fallback* retornando una lista vacía de eventos externos y logueando una advertencia, permitiendo que el sistema responda al usuario únicamente con los eventos de la base de datos local sin interrumpir el servicio.

---

## Alternativas Consideradas

* **Consumo directo sin patrón Adapter (Llamadas HTTP desde controladores o entidades):**  
  *Descartado:* Genera un alto acoplamiento. Cualquier cambio en los nombres de campos de `datos.gov.co` o de `api-colombia.com` obligaría a refactorizar la lógica central de eventos y usuarios.

* **Web Scraping directo de portales de eventos:**  
  *Descartado:* Es frágil ante cambios de diseño HTML, viola términos de servicio de muchos portales, consume ancho de banda excesivo y no ofrece contratos de datos predecibles.

* **Dependencia exclusiva de proveedores comerciales internacionales (Bókun, Viator, Airbnb):**  
  *Descartado:* No corresponden al contexto ni a la geografía del proyecto universitario en Colombia; imponen comisiones por transacción, esquemas propietarios complejos y no se justifican para el alcance del MVP.

---

## Consecuencias

### Positivas:
* **Aislamiento de fallas:** Si `datos.gov.co` o `api-colombia.com` presentan indisponibilidad o latencia excesiva, el sistema no colapsa y continúa atendiendo consultas con los eventos almacenados localmente.
* **Cumplimiento de límites de servicio:** La estrategia de caché garantiza que nunca se supere el umbral de 60 peticiones/minuto por IP en `api-colombia.com`.
* **Mantenibilidad y testabilidad:** La lógica de negocio (`Gestión de Eventos`) depende únicamente de interfaces (`IProveedorEventosExternos`), permitiendo ejecutar pruebas unitarias con implementaciones simuladas (*mocks*) sin necesidad de conexión a internet ni consumo de APIs reales.
* **Alineación con datos oficiales:** Se trabaja con fuentes de datos abiertas reales, verificables y pertinentes para el territorio nacional colombiano.

### Negativas / Costos Aceptados:
* **Sobrecarga de transformación de datos:** Cada adaptador debe transformar manualmente los DTOs de las APIs externas a los objetos y entidades de dominio del sistema.
* **Potencial desfase de datos en caché:** Si se cambia información geográfica o se hace algún cambio dentro de `api-colombia.com`, la aplicación tardará hasta el vencimiento del TTL (24 horas) en reflejarlo. Se acepta este costo por la estabilidad del servicio.
