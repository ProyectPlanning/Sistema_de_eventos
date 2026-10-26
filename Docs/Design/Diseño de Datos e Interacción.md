# Plataforma de Descubrimiento y Gestión de Eventos — Interaction & Data Design v1.0

| | |
|---|---|
| **Team** | Power Rangers |
| **Members** | Cristian Andrés Díaz Ortega - Juan Sebastián Rodríguez Carvajal - Martín Lora Caro - Justin David Vargas Vásquez - Nicolás David Lovera Cabiativa |
| **Status** | Listo para revisión |
| **Date** | 23/10/2026 |
| **Inputs** | `Docs/Design/Diseño Arquitectónico detallado 01.md`, Casos de uso y reglas en `Docs/Requirements/` y `Docs/Business Rules/`, Criterios de aceptación, Historias de usuario, ADR-0003 a ADR-0005. |

---

## 1. Behavior — Selected Use Cases (Comportamiento — Casos de uso seleccionados)

Se seleccionan dos casos de uso de la Primera Etapa con interacción significativa entre componentes:

| # | Caso de uso | Requerimiento | Motivo de selección |
|---|---|---|---|
| 1.1 | Consultar y Filtrar Eventos | `REQ-01` (capstone) | Núcleo de valor del sistema; involucra 5 componentes, dos sistemas externos de eventos y tres flujos no felices (Excepción A, Excepción B, flujo alternativo). |
| 1.2 | Administrar Eventos — Crear Evento | `REQ-02` / `US-02.1` | Única operación de la Etapa 1 que **modifica** el catálogo; obliga a hacer concreta la autorización (identidad y rol) y la persistencia transaccional del evento con sus tarifas y horario. |

### 1.1 Consultar y Filtrar Eventos — from requirement REQ-01

```mermaid
sequenceDiagram
    actor U as Asistente
    participant WEB as Aplicación Web
    participant GW as API Gateway
    participant CE as ControladorDeEventos
    participant CO as ConsultadorEventos
    participant REP as IRepositorioDeEventos
    participant EXT as AdaptadorDeEventosExternos
    participant GOV as API datos.gov.co
    participant COL as API Colombia (api-colombia.com)

    U->>WEB: ingresar filtros
    WEB->>GW: solicitar consulta 
    GW->>CE: consultar(req)
    CE->>CO: consultarEventos(filtro)
    CO->>CO: validarCoherenciaFiltro(filtro)

    alt Excepción A - filtros inválidos
        CO-->>CE: Error de validación de filtros
        CE-->>GW: error de validación
        GW-->>WEB: campo erróneo y motivo
        WEB-->>U: resaltar campo y conservar los demás datos
    else filtros válidos
        CO->>REP: buscarPorCriterios(zonaGeografica,presupuestoMax)
        REP-->>CO: lista de Evento locales candidatos
        CO->>EXT: obtenerEventosExternos(filtro)

        par Consulta a API datos.gov.co 
            EXT->>GOV: consultar catálogo con timeout de 2 s
            alt respuesta exitosa a tiempo
                GOV-->>EXT: registros JSON 
                EXT->>EXT: mapearDatosGov(json)
            else timeout (> 2 s) o error HTTP
                EXT->>EXT: registrar advertencia y lista vacía para datos.gov.co
            end
        and Consulta a API Colombia 
            EXT->>COL: consultar catálogo con timeout de 2 s
            alt respuesta exitosa a tiempo
                COL-->>EXT: registros JSON
                EXT->>EXT: mapearApiColombia(json)
            else timeout (> 2 s) o error HTTP
                EXT->>EXT: registrar advertencia y lista vacía para api-colombia
            end
        end

        alt al menos una API externa respondió
            EXT-->>CO: ResultadoEventosExternosDTO -> eventosExternos, disponibles = true
        else Excepción B - ambas APIs externas fallaron o timeout
            EXT-->>CO: ResultadoEventosExternosDTO -> lista vacía, disponibles = false
        end

        CO->>CO: unificar y aplicarReglasNegocio
        CO-->>CE: EventosDTO(eventos, externosDisponibles)
        CE-->>GW: EventosDTO
        GW-->>WEB: EventosDTO
        alt existen coincidencias
            WEB-->>U: lista de eventos compatibles (aviso si externosDisponibles = false)
        else Flujo alternativo - lista vacía
            WEB-->>U: informar que no hay coincidencias
        end
    end
```

| Use Case step or flow | Message(s) in the diagram | Information exchanged | Operation defined in (Deliverable 1 actualizado) |
|---|---|---|---|
| Flujo principal, pasos 1–2 (ingresar y enviar filtros) | `ingresar filtros`,`solicitar consulta`,`consultar`,`consultarEventos` | País, departamento, ciudad, presupuesto máximo, rango horario (todos opcionales) | `ControladorDeEventos.consultar(req)`, ConsultadorEventos.consultarEventos(filtro)|
| Flujo principal, paso 3 (validar formato y coherencia) | `validarCoherenciaFiltro` | `FiltroEventosDTO` | `ConsultadorEventos.validarCoherenciaFiltro(filtro)`|
| Flujo principal, paso 4 (consultar BD local) | `buscarPorCriterios` | `zonaGegrafica`,`presupuestoMax`,lista de `Evento` | `IRepositorioDeEventos.buscarPorCriterios(zonaGegrafica, presupuestoMax)`|
| Flujo principal, paso 5 (consultar APIs de eventos externas) | `obtenerEventosExternos` | Filtro → `ResultadoEventosExternosDTO` | `IProveedorEventosExternos.obtenerEventosExternos(filtro)` implementado por `AdaptadorDeEventosExternos` |
| Flujo principal, paso 6 (consolidar y aplicar BR-01, BR-02) | `unificar y aplicarReglasNegocio` | Lista unificada de `Evento` cumpliendo los filtros dados | `ConsultadorEventos.aplicarReglasNegocio(eventos, filtro)` |
| Flujo principal, paso 7 (presentar resultados) | `EventosDTO` | `EventosDTO` | `ControladorDeEventos.consultar` devuelve lista de `EventosDTO` |
| Flujo alternativo (sin coincidencias) | `informar que no hay coincidencias` | `EventosDTO` con lista vacía |`ControladorDeEventos.consultar` devuelve lista de `EventosDTO`|
| Excepción A (criterios malformados) | `Excepción A` | campo erróneo y motivo | `validarCoherenciaFiltro` en `ConsultadorEventos` |
| Excepción B (timeout o indisponibilidad externa) | `Excepción B` | `ResultadoEventosExternosDTO`,`externosDisponibles = false` | `AdaptadorDeEventosExternos.obtenerEventosExternos`, timeout 2 s, fallback y advertencia |


### 1.2 Administrar Eventos (Crear Evento) — from requirement REQ-02

```mermaid
sequenceDiagram
    actor O as Organizador
    participant WEB as Aplicación Web
    participant GW as API Gateway
    participant GU as GestorUsuarios
    participant CE as ControladorDeEventos
    participant GE as GestorEventos
    participant EV as Evento
    participant REP as IRepositorioDeEventos

    O->>WEB: completar formulario para creación de evento
    WEB->>GW: solicitar crear evento
    GW->>GU: validarTokenAcceso(token)

    alt token ausente, inválido o expirado
        GU-->>GW: token rechazado
        GW-->>WEB: rechazo por falta de autenticación
        WEB-->>O: solicitar inicio de sesión
    else token válido
        GU-->>GW: UsuarioDTO(id, rol)
        alt rol distinto de ORGANIZADOR
            GW-->>WEB: rechazo por falta de autorización
            WEB-->>O: informar que no tiene permisos de organizador
        else rol ORGANIZADOR
            GW->>CE: crear(req)
            CE->>GE: crearEvento(datos, idOrganizador)
            GE->>EV: construir evento
            EV->>EV: validar los datos del evento
            alt datos incoherentes
                EV-->>GE: campos inválidos
                GE-->>CE: campos inválidos
                CE-->>GW: campos inválidos
                GW-->>WEB: rechazo con campos erróneos
                WEB-->>O: señalar campos a corregir
            else datos válidos
                GE->>REP: guardar(evento)
                REP-->>GE: Evento con id asignado
                GE-->>CE: EventoDTO
                CE-->>GW: EventoDTO
                GW-->>WEB: EventoDTO
                WEB-->>O: confirmar publicación del evento
            end
        end
    end
```


| Use Case step or flow | Message(s) in the diagram | Information exchanged | Operation defined in (Deliverable 1) |
|---|---|---|---|
| Paso 1 — Organizador ingresa los datos del evento | `completar formulario para creación de evento` | `CrearEventoDTO` | Aplicación Web — captura de formularios |
| Paso 2 — Enviar solicitud de creación  | `solicitar crear evento` | Token, `CrearEventoDTO` | API Gateway — enrutamiento |
| Paso 3 — Verificar identidad y rol | `validarTokenAcceso(token)` | Token ,`UsuarioDTO` | `GestorUsuarios.validarTokenAcceso(token)` |
| Paso 4 — Delegar creación | `crear(req)` | `CrearEventoDTO`, `idOrganizador` | `ControladorDeEventos.crear(req)`, `GestorEventos.crearEvento(datos, idOrganizador)` |
| Paso 5 — Validar coherencia de los datos del evento | `construir evento` | Datos del evento | constructor de `Evento`, `HorarioEvento.esValido()` |
| Paso 6 — Persistir evento | `guardar(evento)` | `Evento` sin id asignada,`Evento` con id asignada | `IRepositorioDeEventos.guardar(evento)` |
| Paso 7 — Confirmar publicación| `EventoDTO`,`confirmar pulicacíon de evento` | `EventoDTO` | `ControladorDeEventos.crear` → `EventoDTO` |
| token inválido | `token ausente, inválido o expirado` | Rechazo de autenticación | API Gateway / `validarTokenAcceso` |
| rol distinto de organizador | `rol distinto de ORGANIZADOR` | mensaje de Rechazo de autorización | API Gateway (autorización por rol), `Usuario.esOrganizador()` |
| datos de evento inválidos | `datos incoherentes` | `ErrorValidacion(campos)` | constructor de `Evento` , `HorarioEvento.esValido()` |

---

## 2. Data Design (Diseño de datos)

### 2.1 Principal information the system needs (Información principal)

| Information | Needed by (use cases) | Persisted? | Why (or why not) |
|---|---|---|---|
| **Usuario** (identificación, email, hash de contraseña, rol, estado) | Registrar/Autenticar (`REQ-13`), Crear Evento (`REQ-02`, autorización) | **Sí** | Es propiedad del sistema y debe sobrevivir entre sesiones; el email único y el rol son la base de la autorización. |
| **Evento local** | Consultar (`REQ-01`), Crear/Modificar/Eliminar (`REQ-02`) | **Sí** | El sistema es el dueño autoritativo de los eventos creados por organizadores. |
| **Tarifas del evento** | Consultar (`REQ-01`, BR-02), Crear (`REQ-02`) | **Sí** | BR-02 trabaja sobre múltiples tarifas vigentes; `US-02.1` exige registrar los productos ofrecidos.|
| **Eventos externos** (`datos.gov.co` y `api-colombia.com`) | Consultar (`REQ-01`) | **No** | Su dueño son los proveedores externos y el sistema no controla su ciclo de vida. Persistirlos crearía copias desactualizadas. Se consultan en tiempo real vía `AdaptadorDeEventosExternos` con timeout de 2 s.|
| **Filtros de búsqueda y resultados** | Consultar (`REQ-01`) | **No** | Son transitorios por petición |
| **Token de sesión** | Autenticar (`REQ-13`), Crear Evento (`REQ-02`) | **No** | Se asume un token autocontenido y firmado (JWT, Entregable 1 `IProveedorDeToken`).|
| **Correo de confirmación enviado** | Registrar (`REQ-13`) | **No** | Lo despacha y conserva la API de Gmail.|


### 2.2 Data model (Modelo de datos)

**Representación elegida: Opción A — Relacional.**
> Los datos de la Etapa 1 son entidades fuertemente relacionadas (usuario → evento → tarifas/horario), con restricciones de integridad (email único, FK de organizador, valores no negativos), y la creación de un evento con sus tarifas y horario debe ser **atómica**. Esto encaja con un modelo relacional, coherente con ADR-0003 y ADR-0005.

```mermaid
erDiagram
    USUARIO ||--o{ EVENTO : "organiza"
    EVENTO ||--|{ TARIFA : "ofrece"
    EVENTO ||--|| HORARIO_EVENTO : "se programa en"

    USUARIO {
        int id_usuario PK
        string nombre_completo
        string email UK
        string password_hash
        string rol "ASISTENTE u ORGANIZADOR"
        boolean activo
        datetime fecha_registro
    }
    EVENTO {
        int id_evento PK
        int id_organizador FK
        string titulo
        string descripcion
        string pais
        string departamento
        string ciudad
        string direccion
        int capacidad_maxima "nulo si no tiene aforo limitado"
        int cupos_disponibles "nulo si no tiene aforo limitado"
        string estado "VIGENTE, NO_VIGENTE"
        datetime fecha_creacion
        datetime fecha_actualizacion
    }
    TARIFA {
        int id_tarifa PK
        int id_evento FK
        string nombre "General, VIP, Entrada libre"
        decimal precio_cop
        boolean vigente
    }
    HORARIO_EVENTO {
        int id_horario PK
        int id_evento FK, UK
        string tipo "RANGO o RECURRENTE"
        datetime fecha_inicio "solo RANGO"
        datetime fecha_fin "solo RANGO"
        string dias_semana "solo RECURRENTE"
        time hora_inicio "solo RECURRENTE"
        time hora_fin "solo RECURRENTE"
        date fecha_limite "solo RECURRENTE"
    }
```

| Entity / document type | Meaning in the system | Identifier | Constraints (required, unique, allowed values) |
|---|---|---|---|
| `USUARIO` | Persona registrada que consulta eventos (asistente) o los administra (organizador). | `id_usuario` | `email` obligatorio y **único**; `password_hash` obligatorio (nunca se guarda la contraseña plana); `rol ∈ {ASISTENTE, ORGANIZADOR}`; `activo` obligatorio. |
| `EVENTO` | Evento local publicado por un organizador; el sistema es su dueño autoritativo. | `id_evento` | `id_organizador` obligatorio (FK a `USUARIO` con rol ORGANIZADOR); `capacidad_maxima` nula o `> 0`; `cupos_disponibles` nulo o `0 ≤ cupos ≤ capacidad_maxima`, y ambos nulos o ambos no nulos; `estado ∈ {VIGENTE, NO_VIGENTE}`. |
| `TARIFA` | Tipo de entrada con su precio en COP. | `id_tarifa` | `id_evento` obligatorio; `precio_cop ≥ 0` (0 = entrada libre); `nombre` único dentro del mismo evento; cada evento tiene **al menos una** tarifa. |
| `HORARIO_EVENTO` | Programación temporal del evento: rango continuo o recurrencia semanal. | `id_horario` | `id_evento` obligatorio y único (1:1); `tipo ∈ {RANGO, RECURRENTE}`; si `RANGO`: `fecha_inicio` y `fecha_fin` obligatorias con `fecha_fin > fecha_inicio`; si `RECURRENTE`: `dias_semana`, `hora_inicio`, `hora_fin`, `fecha_limite` obligatorios. |

### 2.3 Data Ownership (Propiedad de los datos)

| Information | Authoritative owner (component responsible for maintaining it) | Consumed by (uses it without owning it) | Access through |
|---|---|---|---|
| Usuario (credenciales, rol, estado) |**Módulo de Usuarios y Perfiles**| API Gateway (identidad y rol para autorizar); Gestión de Eventos (solo el `idOrganizador` recibido del Gateway) |`ControladorDeUsuarios`, `GestorUsuarios`, `IRepositorioUsuarios`|
| Evento local, Tarifa, Horario | **Gestión de Eventos**  | Aplicación Web (a través del API Gateway) | `ControladorDeEventos`, `IRepositorioDeEventos`,`GestorEventos`,`ConsultadorEventos` |
| Eventos externos |**Sistemas externos `datos.gov.co` y `api-colombia.com`**| Gestión de Eventos (`ConsultadorEventos`) | `IProveedorEventosExternos` → `AdaptadorDeEventosExternos` (consultas en tiempo real) |
| Token de sesión |**Módulo de Usuarios y Perfiles**| API Gateway | `GestorUsuarios.validarTokenAcceso(token)` |


### 2.4 Business rules and invariants enforced in data (Reglas e invariantes)

| Business rule or invariant | Where it is enforced (component logic / data constraint / both) | How |
|---|---|---|
| **BR-01** — Solo se muestran eventos con aforo limitado si tienen al menos 1 cupo | **Ambos** | Lógica: `Evento.tieneCupoDisponible()` retorna verdadero si `capacidad_maxima` es nula o `cupos_disponibles ≥ 1`; se aplica en `aplicarReglasNegocio` a eventos locales y externos. |
| **BR-02** — El evento califica si al menos una tarifa vigente es ≤ presupuesto | **Lógica**| `IRepositorioDeEventos.obtenerTarifaMinimaDeEvento(id) <= presupuestoMaximo`.|
| **BR-03** — Filtros combinables u omitidos; sin filtros, listado general | **Lógica** | `CriteriosBusqueda` con campos opcionales; el repositorio y `aplicarReglasNegocio` ignoran los criterios nulos.|
| Email único por usuario | **Ambos** | Lógica: `GestorUsuarios` verifica `buscarPorEmail` antes de registrar.|
| Un evento tiene al menos una tarifa y un horario válido antes de publicarse | **Ambos** | Lógica: `Evento` rechaza la construcción sin tarifas o con `HorarioEvento.esValido() = falso`.|
| Fin de horario posterior al inicio | **Ambos** | Lógica: `HorarioRango.esValido()`, `HorarioRecurrente.esValido()`.|
| Coherencia de columnas según el tipo de horario | **Ambos** | Lógica: polimorfismo de `HorarioEvento`.|
| Solo el organizador dueño modifica o cancela su evento | **Lógica** | Antes de modificar o cancelar el evento se verifica que el token de usuario sea de tipo organizador. |
| Solo usuarios con rol ORGANIZADOR crean eventos | **Lógica** | API Gateway  con `GestorUsuarios.validarTokenAcceso`. |
| Eventos no vigentes o vencidos no aparecen en la consulta | **Lógica** | `aplicarReglasNegocio` descarta `estado = NO_VIGENTE` y eventos con `HorarioEvento.estaVigente(ahora) = falso`. |

---

## 3. Interface Contract (Contrato de interfaz)

**Interaction chosen** (from diagram 1.1, message `consultarEventos`):
> Operación `consultarEventos(filtro)` **provista por Gestión de Eventos** (`ConsultadorEventos`) y **consumida por** `ControladorDeEventos`, que la expone al API Gateway. Se elige porque concentra todo el comportamiento del capstone (`REQ-01`): BR-01, BR-02, BR-03, Excepción A, Excepción B y flujo alternativo.

| Element | Specification |
|---|---|
| **Operation and purpose** | `consultarEventos(filtro: FiltroEventosDTO) : EventosDTO`. Retorna los eventos vigentes, locales y externos (de `datos.gov.co` y `api-colombia.com`), compatibles con los criterios provistos por el asistente.|
| **Input** (parameters and types) | `FiltroEventosDTO`: `pais: String`, `departamento: String`, `ciudad: String`, `presupuestoMaximo: Decimal (COP, ≥ 0)`, `rangoHorario: horario recurrente o por rango`. |
| **Output** (successful result and data structure) | `List<EventoDTO>`. `lista de eventos que cumplen con los filtros, (lista vacía si no hay eventos que cumplan con los filtros)`. |
| **Preconditions** (what the caller must satisfy before invoking) | El filtro llega con tipos correctos. |
| **Postconditions** (what is guaranteed on successful completion) | (1) Cada evento retornado cumple **todos** los criterios provistos. (2) Si hay presupuesto, cada evento tiene al menos una tarifa vigente ≤ presupuesto. (3) Ningún evento con aforo limitado tiene 0 cupos. (4) `externosDisponibles = false` **solo si** ambas fuentes externas fallaron o superaron 2 s; en ese caso `eventos` solo contiene eventos locales.|
| **Failure outcomes** (each failure, and what state is left after it) | **`ErrorValidacion(campo, motivo)`** (Excepción A): presupuesto negativo, `rangoHorario.fin ≤ rangoHorario.inicio` o rango incompleto (solo inicio o solo fin); no se consulta ninguna fuente y se muestra mensaje de error en los campos. **`ErrorServicioNoDisponible`** Se muestra un mensaje informando que el servicio no está disponible |
| **Invariants and side effects** (what must stay true, what may change) | **Solo lectura:** la operación **no modifica** el catálogo local, usuarios ni tarifas. Efectos permitidos: registrar una advertencia en el log cuando falla una fuente externa. |

**Testable examples**

*Datos de prueba locales:* **E1** "Concierto Parque", Bogotá, hoy 19:00–21:00, tarifas General $20.000 y VIP $50.000, cupos 30/100. **E2** "Taller Arte", Bogotá, hoy 18:30–20:00, tarifa única $35.000, cupos 0/20. **E3** "Feria Libro", Bogotá, hoy 18:00–22:00, Entrada libre $0, sin aforo limitado. **E4** "Obra Teatro", Bogotá, hoy 14:00–16:00, tarifa $15.000, cupos 10/50. **E5** "Expo Medellín", Medellín, hoy 09:00–11:00, tarifa $40.000, sin aforo limitado.

| Case | Before | Request | Expected |
|---|---|---|---|
| v1-Filtros combinados | E1–E5 cargados; APIs externas responden sin eventos de Bogotá | `ciudad = Bogotá, presupuestoMaximo = 50000, rango = hoy 18:00–22:00` | `eventos = [E1, E3]`. |
| con múltiples tarifas | Igual | `ciudad = Bogotá, presupuestoMaximo = 30000` | E1 califica (General $20.000 ≤ $30.000, aunque VIP sea $50.000); también E3 y E4.|
| cupos disponibles | Igual al primer caso | `ciudad = Bogotá, presupuestoMaximo = 40000, rango = hoy 18:00–22:00` | E2 (compatible en precio y horario, cupos = 0) **no** aparece. |
|  Excepción B | Igual; APIs externas no responden en 2 s | Mismo filtro de V1 | `eventos = [E1, E3]` (solo `LOCAL`), `externosDisponibles = false`; la UI muestra el aviso.|
| Excepción A | Igual | `presupuestoMaximo = -1000` o `rango = hoy 22:00–18:00` | `ErrorValidacion(campo = presupuestoMaximo y rangoHorario)`; no se consulta repositorio ni APIs externas. |
| Sin coincidencias | Igual | `ciudad = Medellín, presupuestoMaximo = 10000, rango = hoy 08:00–12:00` | `eventos = []`, éxito; la UI informa y sugiere ajustar filtros. |
| Sin filtros | Igual | `{}` | Éxito con el listado de eventos aleatorios, aquí E2 se excluye por cupos = 0. |

---

## 4. Cross-Consistency & Changes to Deliverable 1 (Consistencia cruzada)

| Check | Result |
|---|---|
| Every participant in a sequence diagram is an actor, a component, a class or an external system from Deliverable 1 | **Cumple.** Actores: Asistente, Organizador (Usuario del Entregable 1). Componentes: Aplicación Web, API Gateway. Clases: `ControladorDeEventos`, `ConsultadorEventos`, `GestorEventos`, `Evento`, `GestorUsuarios`, `IRepositorioDeEventos`, `AdaptadorDeEventosExternos`. Sistemas externos: API datos.gov.co, API Colombia (`api-colombia.com`). |
| Every message corresponds to a capability, operation or contract | **Cumple** Todos los mensajes mapean a operaciones del Entregable 1. |
| Every entity or document type is reflected in the class diagrams, or the reason it is not is stated | **Cumple parcialmente.** `USUARIO` ↔ `Usuario`, `EVENTO` ↔ `Evento`, `HORARIO_EVENTO` ↔ `HorarioEvento` / `HorarioRango` / `HorarioRecurrente`. TARIFA no tiene clase asociada porque se trata como un tipo de dato dentro de evento.|
| Every persisted information element has exactly one authoritative owner | **Cumple.** Usuario → Módulo de Usuarios; Evento, Tarifa y Horario → Gestión de Eventos. |
| The contract agrees with the sequence diagram and with the data model (same behavior in all three views) | **Cumple** `externosDisponibles` aparece en el diagrama (Excepción B), en el contrato (postcondición 4). Se usa `TARIFA.vigente` y `precio_cop` en el modelo, `tarifaMinimaVigente` en el contrato y la regla se implementa en `aplicarReglasNegocio`.|

**Changes made to Deliverable 1 because of this deliverable**
> Se unificó las APIs externas en `AdaptadorDeEventosExternos` para consultar eventos (CTI en `datos.gov.co` y museos/parques en `api-colombia.com`), eliminando la interfaz `IProveedorGeografico`. Asimismo, se prescinde de cualquier capa de caché local.
---

## 5. Open Questions (Preguntas abiertas)

| ID | Pregunta | Consecuencia si no se resuelve | Decisión necesaria / responsable |
|---|---|---|---|
| `OQ-01` | Los eventos externos de `datos.gov.co` o `api-colombia.com` pueden no traer precio ni cupos. ¿Se incluyen o se excluyen cuando el usuario filtra por presupuesto o aforo? | BR-01 y BR-02 no pueden evaluarse sobre datos ausentes; incluirlos o excluirlos cambia los resultados. | Equipo, tras revisar el esquema real de ambos datasets. |

---

## 6. Optional — AI-Assisted Design Reflection (Reflexión sobre diseño asistido por IA)

> *Sección para completar por el equipo. No se describe aquí una experiencia que el equipo no haya tenido.*
>
> **Recomendación de la IA:** Crear la entidad `TARIFA`
> 
> **Decisión del equipo:** Aceptada
> 
> **Razón:** Como un evento puede tener diferente tipos de tarifas (cada una con su nombre, precio, estado), es más natural verla como una entidad aparte que se relaciona con `EVENTO`

---

## 7. Consistency Checklist (Lista de verificación)

- [ ] Two use cases from the project, each traceable to a Use Case written in the requirements. — *1.1 sí (`REQ-01`). Falta 1.2*
- [x] Each sequence diagram shows the main flow and at least one alternative or exception flow.
- [x] No business behavior is invented: anything unspecified is marked as an assumption or Open Question.
- [x] Section 2.1 explains what is NOT persisted as well as what is.
- [x] The data model has identifiers, relationships and constraints, not only boxes.
- [x] Every piece of principal information has one authoritative owner, and consumers are listed (Section 2.3).
- [x] The contract defines input, output, preconditions, postconditions and failure outcomes.
- [x] Sequence, data model and contract describe the same behavior. — 
- [x] Diagrams render correctly on GitHub (or the exported images are embedded).

---
