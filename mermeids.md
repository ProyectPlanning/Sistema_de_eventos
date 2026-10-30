
```mermaid
flowchart TD
    A([Asistente solicita búsqueda de eventos]) --> B["1. Usuario ingresa filtros: zona, presupuesto, rango horario"]
    B --> C["2. Usuario ejecuta la consulta"]
    C --> D["3. Sistema valida formato y coherencia de filtros"]
    D --> E{"¿Filtros válidos?"}

    E -- "No" --> F["EXCEPCIÓN A: Mostrar error de validación en pantalla"]
    F --> B

    E -- "Sí" --> G["4. Sistema consulta Base de Datos local por zona y presupuesto máximo"]
    G --> P{"¿Base de datos respondió?"}

    P -- "No (error de conexión o timeout)" --> Q["EXCEPCIÓN C: Base de datos no respondió. Registrar fallo y continuar sin eventos locales"]
    Q --> R

    P -- "Sí" --> R["5. Sistema consulta API de eventos externa (timeout máx. 2000 ms)"]
    R --> H{"¿API externa disponible en tiempo límite?"}

    H -- "No (timeout o error)" --> T{"¿La Base de Datos también falló?"}

    T -- "Sí" --> U["EXCEPCIÓN D: Ambas fuentes fallaron. Informar al usuario que la Base de Datos y la API externa no respondieron; intentar más tarde"]
    U --> V([Postcondición: Usuario informado de la falla del servicio, sin resultados])

    T -- "No" --> I["EXCEPCIÓN B: Registrar fallo y continuar solo con eventos locales"]
    I --> S

    H -- "Sí" --> S["6. Unificar eventos locales y externos"]
    S --> J["7. Filtrar eventos por BR-01 (cupo disponible) y BR-02 (rango horario)"]

    J --> K{"¿Se encontraron eventos coincidentes?"}
    K -- "Sí" --> L["8. Presentar lista de eventos compatibles"]
    L --> M([Postcondición: Usuario visualiza eventos viables])

    K -- "No" --> N["FLUJO ALTERNATIVO: Informar ausencia de coincidencias y sugerir ajustes"]
    N --> O([Postcondición: Usuario orientado para flexibilizar búsqueda])

    classDef mainflow fill:#1E2761,color:#ffffff,stroke:#1E2761;
    classDef alt fill:#F2A541,color:#1E2761,stroke:#F2A541;
    classDef exception fill:#B3261E,color:#ffffff,stroke:#B3261E;

    class B,C,D,G,R,S,J,L mainflow;
    class N alt;
    class F,I,Q,U exception;
```

```text
consultarEventos(filtro):
    TRY:
        validarCoherenciaFiltro(filtro)
    EXCEPTION (invalidField):
        throw(invalidField) // EXCEPCIÓN A: precios negativos o fechas incoherentes

    localesDisponibles = VERDADERO
    externosDisponibles = VERDADERO

    TRY:
        eventosLocales = repositorio.buscarPorCriterios(filtro.zonaGeografica, filtro.presupuestoMaximo)
    EXCEPTION (DatabaseError, TimeoutError):
        localesDisponibles = FALSO // EXCEPCIÓN C
        eventosLocales = LISTA_VACIA

    TRY:
        respuestaExterna = IProveedorEventosExternos.obtenerEventosExternos(filtro) // timeout max 2000 ms
        eventosExternos = respuestaExterna.eventosValidados
    EXCEPTION (TimeoutError, NetworkError):
        IF NO localesDisponibles:
            throw ServicioNoDisponibleError("Base de datos y API externa no respondieron") // EXCEPCIÓN D
        externosDisponibles = FALSO // EXCEPCIÓN B
        eventosExternos = LISTA_VACIA

    eventosConsolidados = unificar(eventosLocales, eventosExternos)

    listaFinal = []
    FOR evento IN eventosConsolidados:
        IF evento.tieneCupoDisponible():
            IF filtro.rangoHorario ES NULO O evento.horario.coincideConRango(filtro.rangoHorario):
                listaFinal.agregar(mapearADTO(evento))

    RETURN ResultadoConsultaDTO(
        eventos = listaFinal,                  // vacía → Flujo Alternativo
        localesDisponibles = localesDisponibles,
        externosDisponibles = externosDisponibles
    )
```
```mermaid
sequenceDiagram
    actor U as Asistente
    participant WEB as Aplicación Web
    participant GW as API Gateway
    participant CE as ControladorDeEventos
    participant CO as ConsultadorEventos
    participant REP as IRepositorioDeEventos
    participant EXT as AdaptadorDeEventosExternos

    U->>WEB: ingresar filtros
    WEB->>GW: solicitar consulta
    GW->>CE: consultar(filtro)
    CE->>CO: consultarEventos(filtro)
    CO->>CO: validarCoherenciaFiltro(filtro)

    alt Excepción A - filtros inválidos
        CO-->>CE: Error de validación de filtros
        CE-->>GW: error de validación
        GW-->>WEB: campo erróneo y motivo
        WEB-->>U: resaltar campo y conservar los demás datos
    else filtros válidos
        CO->>REP: buscarPorCriterios(zonaGeografica, presupuestoMax)

        alt base de datos respondió
            REP-->>CO: lista de Evento locales candidatos
        else Excepción C - base de datos no respondió
            REP-->>CO: DatabaseError / TimeoutError
            CO->>CO: localesDisponibles = false, eventosLocales = lista vacía
        end

        CO->>EXT: obtenerEventosExternos(filtro)

        alt al menos una API externa respondió
            EXT-->>CO: ResultadoEventosExternosDTO 
        else Excepción B - APIs externas fallaron o timeout
            EXT-->>CO: Lanzar error de TimeoutError o NetworkError
            CO->>CO: externosDisponibles = false
        end

        alt Excepción D - ambas fuentes fallaron (localesDisponibles = false y externosDisponibles = false)
            CO-->>CE: ServicioNoDisponibleError
            CE-->>GW: error servicio no disponible 
            GW-->>WEB: servicio no disponible
            WEB-->>U: informar que la búsqueda no está disponible, intentar más tarde
        else al menos una fuente disponible
            CO->>CO: unificar y aplicarReglasNegocio(eventos, filtro)
            CO-->>CE: ResultadoConsultaDTO(eventos, localesDisponibles, externosDisponibles)
            CE-->>GW: ResultadoConsultaDTO
            GW-->>WEB: ResultadoConsultaDTO

            alt existen coincidencias
                WEB-->>U: lista de eventos compatibles (aviso si alguna fuente = false)
            else Flujo alternativo - lista vacía
                WEB-->>U: informar que no hay coincidencias y sugerir ajustes (aclarar si alguna fuente = false)
            end
        end
    end
```

| Use Case step or flow | Message(s) in the diagram | Information exchanged | Operation defined in (Deliverable 1) |
|---|---|---|---|
| Flujo principal, pasos 1–2 (ingresar y enviar filtros) | `ingresar filtros`, `solicitar consulta`, `consultar`, `consultarEventos` | País, departamento, ciudad, presupuesto máximo, rango horario (todos opcionales) | `ControladorDeEventos.consultar(filtro)`, `ConsultadorEventos.consultarEventos(filtro)` |
| Flujo principal, paso 3 (validar formato y coherencia) | `validarCoherenciaFiltro` | `FiltroEventosDTO` | `ConsultadorEventos.validarCoherenciaFiltro(filtro)` |
| Flujo principal, paso 4 (consultar BD local) | `buscarPorCriterios`, `lista de Evento locales candidatos` | `zonaGeografica`, `presupuestoMax` → lista de `Evento` | `IRepositorioDeEventos.buscarPorCriterios(zonaGeografica, presupuestoMax)` |
| Flujo principal, paso 5 (consultar APIs de eventos externas) | `obtenerEventosExternos`, `ResultadoEventosExternosDTO` | Filtro → `ResultadoEventosExternosDTO` | `IProveedorEventosExternos.obtenerEventosExternos(filtro)` implementado por `AdaptadorDeEventosExternos`|
| Flujo principal, pasos 6–7  | `unificar y aplicarReglasNegocio` | Lista unificada de `Evento` que cumple los filtros dados | `ConsultadorEventos.aplicarReglasNegocio(eventos, filtro)` |
| Flujo principal, paso 8 (presentar resultados) | `ResultadoConsultaDTO`, `lista de eventos compatibles` | `ResultadoConsultaDTO(eventos, localesDisponibles, externosDisponibles)` | `ControladorDeEventos.consultar` devuelve `ResultadoConsultaDTO` |
| Flujo alternativo (sin coincidencias, paso 7) | `informar que no hay coincidencias y sugerir ajustes` | `ResultadoConsultaDTO` con lista vacía, `localesDisponibles`, `externosDisponibles` | `ControladorDeEventos.consultar` devuelve `ResultadoConsultaDTO` |
| Excepción A (criterios malformados, paso 3) | `Excepción A`, `Error de validación de filtros` | Campo erróneo y motivo | `ConsultadorEventos.validarCoherenciaFiltro(filtro)` lanza `ErrorValidacion` |
| Excepción B (timeout o falla de las APIs externas, paso 5) | `Excepción B`, `TimeoutError / NetworkError` | Error capturado → `eventosExternos` = lista vacía, `externosDisponibles = false` | `AdaptadorDeEventosExternos.obtenerEventosExternos` lanza el error (timeout 2 s); `ConsultadorEventos.consultarEventos` lo captura y continúa con eventos locales |
| Excepción C (base de datos no respondió, paso 4) | `Excepción C`, `DatabaseError / TimeoutError` | Error capturado → `eventosLocales` = lista vacía, `localesDisponibles = false` | `IRepositorioDeEventos.buscarPorCriterios` lanza el error; `ConsultadorEventos.consultarEventos` lo captura y continúa con la consulta externa |
| Excepción D (ambas fuentes fallaron, paso 5) | `Excepción D`, `ServicioNoDisponibleError`, `servicio no disponible` | `localesDisponibles = false` y error externo →  mensaje de servicio no disponible | `ConsultadorEventos.consultarEventos` lanza `ServicioNoDisponibleError` |
