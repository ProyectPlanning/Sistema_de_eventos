# ADR-0007: Estructura de archivos
 
<!--
Nombra el archivo con el número consecutivo y un slug corto, por ejemplo:
docs/adr/0001-usar-postgresql-como-base-de-datos-principal.md
Los ADR se numeran en orden y NUNCA se editan después de aceptados para
cambiar la decisión en sí (sí puedes corregir errores de redacción). Si la
decisión cambia, escribes un ADR nuevo y marcas este como reemplazado
(ver "Estado"). Así el repositorio queda como una bitácora histórica de
por qué el sistema es como es.
-->
 
Autores:
 - Justin David Vargas Vasquez
 - Cristian Andres Diaz Ortega
 - Juan Sebastian Rodriguez Carvajal
 - Nicolas David Lovera Cabiativa
 - Martin Lora Caro

Fecha: 2026-11-5
 
## Estado
 
<!--
Uno de: Propuesto | Aceptado | Rechazado | Reemplazado por ADR-000Y | Obsoleto
Un ADR "Propuesto" está en discusión. Una vez el equipo decide, pasa a
"Aceptado" (o "Rechazado" si se descarta la propuesta) y ya no se
modifica su contenido de fondo.
-->
 
Aceptado
## Contexto
 
<!--
¿Qué problema técnico, restricción o fuerza nos obliga a tomar esta
decisión ahora? Describe la situación de forma neutral y objetiva —
todavía no es el lugar para argumentar a favor de una opción.
Ejemplos de fuerzas en juego: requisitos no funcionales (rendimiento,
seguridad, escalabilidad), restricciones de equipo o de tiempo,
deuda técnica existente, compatibilidad con sistemas ya construidos.
-->
Hasta ahora, el repositorio sólo contiene un README y su respectiva documentación en la carpeta Docs. La parte de código no se ha comenzado a trabajar, pero no se tiene claro tampoco la estructura de carpetas que usará el repositorio.
Definir cual va hacer la estructura de carpetas que se utilizará en el GitHub.
## Decisión
 
<!--
Qué vamos a hacer, en una o dos frases claras y en tiempo presente
("Vamos a usar X para Y"). Esta es la sección más corta del documento:
un ADR no es un RFC, no necesita convencer a nadie aquí — la
justificación ya quedó en "Contexto" y las alternativas descartadas
van abajo.
-->
Definimos que se usará la siguiente estructura: 
### Estructura Orientada a responsabilidades
Ejemplo:
En las siguientes carpetas se encontraran los archivos relacionados con:
* backend/: La lógica de negocio.
* frontend/: La vista del usuario y las peticiones.
* docs/: Documentos generales.
* README: Explicación del proyecto.

## Alternativas consideradas
 
<!--
Qué otras opciones se evaluaron y por qué se descartaron. No hace
falta un análisis exhaustivo, basta con dejar constancia de que se
consideraron y el motivo del descarte (costo, madurez, curva de
aprendizaje, no cumple un requisito, etc.).
-->
- Estructura clásica por capas: Aunque es funcional para una app pequeña, la navegación es molesta y modificar un solo elemento puede requerir de alterar varias carpetas.
- Arquitectura limpia estricta: Aunque se separa por las reglas de negocio de los casos de uso y es testeable, esto genera demasiada complejidad.
 
## Consecuencias
 
<!--
¿Qué se vuelve más fácil o más difícil después de esta decisión?
Incluye efectos positivos y negativos por igual — un ADR honesto
también documenta el costo que se está aceptando (deuda técnica
introducida, dependencia nueva, curva de aprendizaje del equipo).
-->
 
---

Se pueden generar duplicaciones en la logica, si no se tienen claros los limites del dominio de negocio desde el principio
