# ADR-0007: Estructura de carpetas del repositorio

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
El proyecto cuenta con una parte de lógica de negocio (back-end en NestJS, ADR-0002), una interfaz de usuario (front-end en React, ADR-0001) y documentación técnica. Sin una organización acordada, cada miembro ubica los archivos a su propio criterio, dificultando la navegación y el mantenimiento, por lo que se requería definir cuál será la estructura de carpetas que se utilizará en el repositorio, de forma coherente con la arquitectura de monolito modular definida en el ADR-0005.
## Decisión
 
<!--
Qué vamos a hacer, en una o dos frases claras y en tiempo presente
("Vamos a usar X para Y"). Esta es la sección más corta del documento:
un ADR no es un RFC, no necesita convencer a nadie aquí — la
justificación ya quedó en "Contexto" y las alternativas descartadas
van abajo.
-->
Se adopta una **Estructura Orientada a Responsabilidades** en el primer nivel, combinada con una **Estructura Orientada a Características (Feature-Driven)** dentro de `backend/` y `frontend/`: los archivos se agrupan según el dominio de negocio o caso de uso al que pertenecen (`eventos`, `usuarios`), no según su rol técnico.
 
Las carpetas de primer nivel contienen:
 
* `backend/`: La lógica de negocio.
* `frontend/`: La vista del usuario y las peticiones.
* `Docs/`: Documentos generales.
* `README.md`: Explicación del proyecto.
### Ejemplo de estructura base
 
```text
sistemaDeEventos/
├── README.md                     # Explicación del proyecto
├── docs/                         # Documentos generales
│   ├── adrs/                     # Decisiones de arquitectura
│   ├── design/                   # Diseños y diagramas
│   └── requirements/             # Requisitos
├── backend/                      # Lógica de negocio
│   ├── package.json
│   ├── src/
│   │   ├── main.ts               # Punto de entrada de NestJS
│   │   ├── core/                 # Configuración y conexión a la base de datos
│   │   ├── eventos/              # Módulo de eventos (REQ-01, REQ-02)
│   │   │   ├── Eventos_Controller.ts
│   │   │   ├── Eventos_Service.ts
│   │   │   ├── Eventos_Repository.ts
│   │   │   ├── Eventos_Entity.ts
│   │   │   └── Eventos_Dto.ts
│   │   └── usuarios/             # Módulo de usuarios (REQ-13), misma estructura
│   └── tests/                    # Pruebas unitarias y de integración
└── frontend/                     # Vista del usuario y peticiones
    ├── package.json
    └── src/
        ├── api/                  # Cliente HTTP hacia el API Gateway
        ├── features/             # Componentes y hooks por funcionalidad
        │   ├── eventos/
        │   └── usuarios/
        └── shared/               # Componentes UI reutilizables
```


## Alternativas consideradas
 
<!--
Qué otras opciones se evaluaron y por qué se descartaron. No hace
falta un análisis exhaustivo, basta con dejar constancia de que se
consideraron y el motivo del descarte (costo, madurez, curva de
aprendizaje, no cumple un requisito, etc.).
-->
- **Estructura clásica por capas (Layer-Driven / Técnica):** Agrupa los archivos por su rol técnico dentro del framework (una carpeta para todos los controladores, otra para todos los servicios, etc.). Es muy fácil de entender y configurar al inicio, ideal para aplicaciones pequeñas o prototipos rápidos. Se descarta porque, a medida que el proyecto crece, la navegación se vuelve molesta: para modificar un solo endpoint hay que abrir archivos en varias carpetas distintas.
```text
  backend/src/
  ├── controllers/
  │   ├── Eventos_Controller.ts
  │   └── Usuarios_Controller.ts
  ├── services/
  │   ├── Eventos_Service.ts
  │   └── Usuarios_Service.ts
  └── entities/
      ├── Eventos_Entity.ts
      └── Usuarios_Entity.ts
```
 
- **Arquitectura limpia estricta (Clean Architecture / Hexagonal):** Lleva la separación de conceptos al extremo, dividiendo el código en Dominio (reglas de negocio puras), Aplicación (casos de uso) e Infraestructura (controladores HTTP, repositorios SQL, librerías externas). Logra un desacoplamiento total del framework y hace el código de negocio 100 % testeable sin base de datos. Se descarta porque añade demasiada complejidad y código repetitivo (*boilerplate*) para un proyecto que está naciendo, o que no requiere cambiar de base de datos con frecuencia.
```text
  backend/src/eventos/
  ├── domain/            # Entidades puras sin frameworks
  ├── application/       # Casos de uso / interfaces
  └── infrastructure/    # Controladores HTTP, repositorios SQL
```

## Consecuencias
 
<!--
¿Qué se vuelve más fácil o más difícil después de esta decisión?
Incluye efectos positivos y negativos por igual — un ADR honesto
también documenta el costo que se está aceptando (deuda técnica
introducida, dependencia nueva, curva de aprendizaje del equipo).
-->

### Positivas:
- **Escalabilidad:** Si el proyecto crece con más módulos, cada uno trabja dentro de la carpeta de su característica sin tocar código ajeno.
- **Responsabilidad única:** Cada carpeta agrupa todo lo necesario para una característica, lo que facilita mantener el principio de responsabilidad única.
- **Coherencia con NestJS:** La organización por módulos es la que impone el propio framework (ADR-0002), por lo que no hay que forzar una estructura ajena.
- **Cambios localizados:** Modificar una funcionalidad implica tocar pocas carpetas, ya que sus archivos relacionados se mantienen juntos.


### Negativas:
 
- **Posible duplicación de lógica:** Si no se tienen claros los límites del dominio de negocio desde el principio, pueden generarse duplicaciones de lógica entre módulos.
