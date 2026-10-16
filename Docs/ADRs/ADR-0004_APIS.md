# ADR-0004: Adoptar Adapter Pattern con preferencia por OCTO para integraciones externas
<!-- docs/adr/0004-adapter-pattern-octo-integraciones-externas.md -->

## Autores:

- Justin David Vargas Vasquez
- Cristian Andrés Díaz Ortega

## Contexto

La plataforma debe integrarse con proveedores externos de actividades por medio de APIs(Bókun, FareHarbor, Amadeus, OTAs como Viator, GetYourGuide, Airbnb) y, en etapas avanzadas, con restaurantes y cafeterías. 
Cada proveedor expone APIs propietarias con contratos, autenticación y semánticas distintas. Se necesita además exponer una API interna para el frontend y, a futuro, para terceros. El objetivo es poder añadir o 
retirar proveedores sin reescribir la lógica central de reservas. La estabilidad del flujo de reserva es crítica: la caída de un proveedor no debe tumbar el resto de la plataforma.

## Decisión

Vamos a exponer una API REST interna consumida por el frontend, y a encapsular cada integración externa detrás de un Adapter Pattern con una interfaz común 
(ActivityProvider con getAvailability, createBooking, cancelBooking, etc.). Cuando el proveedor lo soporte, se preferirá el estándar abierto OCTO; para los que no, 
se implementará un adaptador específico (Bókun Channel Manager API, FareHarbor External API, etc.). Los pagos se canalizarán con Stripe Connect para soportar onboarding de proveedores y comisiones de plataforma.

## Alternativas consideradas

- Integraciones directas sin patrón: cada módulo del sistema llamaría a cada API directamente. Descartado: acoplamiento alto, cambios en un proveedor obligarían a refactorizar el núcleo.

- GraphQL federado: consultas más eficientes para el frontend y unificación de esquemas. Descartado para el MVP por complejidad de caching, autorización y federación; se reconsiderará si el número de consumidores crece.

- gRPC interno: comunicación para conectar microservicios, rendimiento superior, pero tiene curva de aprendizaje alta y ecosistema menos amigable con Node.js para el tamaño del equipo. Descartado.

- Bókun como único intermediario: simplificaría la integración con múltiples OTAs, pero introduce dependencia de un intermediario con costos por transacción y control limitado sobre la experiencia. Se usará como un adaptador más, no como capa única.

- Webhooks genéricos sin idempotencia: descartado; se implementarán webhooks con HMAC, reintentos e idempotencia desde el inicio.

- Pasarelas alternativas a Stripe Connect (Adyen, MercadoPago): Stripe Connect se elige por madurez en modelos marketplace, documentación y disponibilidad de talento.

## Consecuencias

### Positivas:

- Añadir un proveedor nuevo implica implementar un adaptador, no modificar el núcleo.

- Aislamiento de fallos: la caída de un proveedor no afecta al resto.

- Cada adaptador es testeable de forma independiente con mocks.

- OCTO como estándar emergente reduce trabajo cuando un proveedor lo adopta.

- Stripe Connect resuelve pagos multi-proveedor, comisiones y onboarding.

### Negativas / costos aceptados:

- Mantenimiento multiplicado: cada integración tiene su ciclo de vida, versiones de API y documentación. Con 5+ proveedores se requiere esfuerzo dedicado continuo.

- Dependencia de Stripe: costos por transacción y lock-in moderado; migrar después es costoso.

- REST en lugar de GraphQL: el frontend puede requerir múltiples llamadas para una vista; se compensa con endpoints agregados específicos.
