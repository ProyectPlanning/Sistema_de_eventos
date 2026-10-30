
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

