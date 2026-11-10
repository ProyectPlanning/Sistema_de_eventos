# ADR-0006: Convenciones de nomenclatura
 
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

Fecha: 2026-11-10
 
## Estado
 
<!--
Uno de: Propuesto | Aceptado | Rechazado | Reemplazado por ADR-000Y | Obsoleto
Un ADR "Propuesto" está en discusión. Una vez el equipo decide, pasa a
"Aceptado" (o "Rechazado" si se descarta la propuesta) y ya no se
modifica su contenido de fondo.
-->
 
Validado
## Contexto
 
<!--
¿Qué problema técnico, restricción o fuerza nos obliga a tomar esta
decisión ahora? Describe la situación de forma neutral y objetiva —
todavía no es el lugar para argumentar a favor de una opción.
Ejemplos de fuerzas en juego: requisitos no funcionales (rendimiento,
seguridad, escalabilidad), restricciones de equipo o de tiempo,
deuda técnica existente, compatibilidad con sistemas ya construidos.
-->
Durante el desarrollo surgió el problema de que cada integrante nombraba archivos, variables y clases con criterios distintos. Esto genera inconsistencias en el repositorio, dificulta la búsqueda de archivos, complica las revisiones de código y aumenta el tiempo que un miembro necesita para entender el código de otro, por lo que requería tomar una decisión formal sobre la nomenclatura de los archivos y del código, con el fin de contar con una estructura fija que todos los miembros del equipo deban seguir.
  
## Decisión
 
<!--
Qué vamos a hacer, en una o dos frases claras y en tiempo presente
("Vamos a usar X para Y"). Esta es la sección más corta del documento:
un ADR no es un RFC, no necesita convencer a nadie aquí — la
justificación ya quedó en "Contexto" y las alternativas descartadas
van abajo.
-->
Se adoptan las siguientes convenciones de nomenclatura para todo el repositorio:
 
| Elemento | Convención | Ejemplo correcto | Ejemplo incorrecto |
|---|---|---|---|
| Variables | `camelCase` | `presupuestoMaximo` | `presupuesto_maximo`, `presupuestomaximo` |
| Constantes | `camelCase` | `maxIntentosLogin` | `MAX_INTENTOS_LOGIN`, `max-intentos-login` |
| Clases | `PascalCase` | `EventosService` | `eventosService`, `eventos_service` |
| Archivos | `Pascal_Snake_Case` | `Eventos_Service.ts` | `eventosService.ts`, `eventos-service.ts` |

### Excepciones
 
Los archivos cuyo nombre es exigido por una herramienta o por el ecosistema conservan su nombre estándar: `README.md`, `package.json`, `tsconfig.json`, `docker-compose.yml`, `main.ts` (punto de entrada de NestJS), entre otros.

### Ejemplos:
 
#### Variables y constantes (`camelCase`)
 
```typescript
// Variables
let aforoDisponible = 0;
const nombreOrganizador = "Laura";
const eventosFiltrados = [];
 
// Constantes
const maxIntentosLogin = 5;
const tiempoExpiracionToken = 3600;
```
 
#### Clases (`PascalCase`)
 
```typescript
class EventosService {}
class UsuariosController {}
class HorarioRango {}
```
 
#### Archivos (`Pascal_Snake_Case`)
 
```text
Eventos_Controller.ts
Eventos_Service.ts
Eventos_Repository.ts
Usuarios_Service.ts
Horario_Rango.ts
Horario_Rango.test.ts
```
 
#### Ejemplo combinado
 
Archivo `Eventos_Service.ts`, que contiene la clase `EventosService` con sus variables y constantes:
 
```typescript
// Eventos_Service.ts
const maxEventosPorPagina = 20;
 
export class EventosService {
  constructor(private readonly eventosRepository: EventosRepository) {}
 
  filtrarEventos(presupuestoMaximo: number) {
    const eventosFiltrados = this.eventosRepository.buscarPorPrecio(presupuestoMaximo);
    return eventosFiltrados.slice(0, maxEventosPorPagina);
  }
}
```
 
## Alternativas consideradas
 
<!--
Qué otras opciones se evaluaron y por qué se descartaron. No hace
falta un análisis exhaustivo, basta con dejar constancia de que se
consideraron y el motivo del descarte (costo, madurez, curva de
aprendizaje, no cumple un requisito, etc.).
-->

- **`flatcase` para las variables** (`presupuestomaximo`): descartado. Al no separar visualmente las palabras, se reduce notablemente la legibilidad en nombres largos.
- **`kebab-case` para las variables** (`presupuesto-maximo`): descartado. El guion no es un carácter válido en identificadores de la mayoría de lenguajes, ya que se interpreta como el operador de resta. Solo sería viable en archivos, pero no se adopta para mantener una convención uniforme.
 
## Consecuencias
 
<!--
¿Qué se vuelve más fácil o más difícil después de esta decisión?
Incluye efectos positivos y negativos por igual — un ADR honesto
también documenta el costo que se está aceptando (deuda técnica
introducida, dependencia nueva, curva de aprendizaje del equipo).
-->
 
### Positivas:
 
- **Mejor organización por la estandarización:** Todos los miembros nombran los elementos de la misma forma, lo que reduce discusiones y correcciones durante las revisiones de código.
- **Legibilidad:** El tipo de elemento puede identificarse a simple vista por su formato.

### Negativas:
 
- **Curva de adaptación:** Los miembros acostumbrados a otras convenciones deberán adaptarse.
 
