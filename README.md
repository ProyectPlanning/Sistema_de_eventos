# Plataforma de Descubrimiento y Gestión de Eventos

> **Proyecto de Curso:** Ingeniería de Software I (2016701) · 2026-II  
> **Facultad de Ingeniería · Departamento de Sistemas e Industrial**  
> **Universidad Nacional de Colombia — Sede Bogotá**  
> **Docente:** Alejandro Pulido Cruz  
> **Equipo:** *Power Rangers*  
> **Integrantes:**  
> - Cristian Andrés Díaz Ortega  
> - Juan Sebastián Rodríguez Carvajal  
> - Martín Lora Caro  
> - Justin David Vargas Vásquez  
> - Nicolás David Lovera Cabiativa  

---

## 1. Descripción del Producto y Problema que Resuelve

### 1.1 El Problema
Los asistentes a eventos enfrentan una gran pérdida de tiempo e incertidumbre al buscar planes de entretenimiento y actividades culturales o formativas: con frecuencia encuentran opciones atractivas pero incompatibles con su presupuesto disponible, en horarios cruzados con sus jornadas laborales/académicas o en ubicaciones geográficas inaccesibles. Por su parte, los organizadores locales requieren una vía ágil y confiable para publicar, gestionar y visibilizar sus actividades ante un público con intención real de asistencia.

### 1.2 ¿Qué decide nuestro software que hoy se decide a mano?
El sistema no es un simple CRUD de almacenamiento de registros. El software decide de manera automatizada:
1. **Compatibilidad multidimensional de actividades:** Evalúa en tiempo real si un evento cumple simultáneamente con el techo presupuestal del usuario (regla `BR-02`), su rango horario de disponibilidad (algoritmo de solapamiento temporal) y su zona geográfica.
2. **Disponibilidad efectiva de aforo:** Descarta automáticamente eventos agotados o con cupo cero (regla `BR-01`), evitando que el usuario seleccione planes inviables.
3. **Aislamiento y tolerancia a fallos externos:** Decide dinámicamente activar mecanismos de contingencia (*fallback*) cuando un proveedor externo de eventos presenta caídas o demoras, garantizando la continuidad del servicio con el catálogo local incluso cuando los proveedores externos presentan demoras, caídas o errores por exceso de solicitudes (como el límite de 60 req/min en `api-colombia.com`)..

---

## 2. Alcance de la Primera Etapa (Incremento 1 / MVP)

Conforme a la metodología **MoSCoW** y la gestión de capacidad limitada, la **Primera Etapa** del proyecto se enfoca estrictamente en construir un incremento vertical funcional (*vertical slice*) que integre Front-End, API Gateway, Lógica de Negocio y Persistencia para **únicamente estos tres requerimientos nucleares**: `REQ-01`, `REQ-02` y `REQ-13`

### 2.1 Requerimientos Priorizados de la Primera Etapa

| ID | Nombre | Descripción Breve | Rol / Actor | Caso de Uso |
|:---:|:---|:---|:---:|:---|
| **REQ-01** | **Búsqueda y filtrado de eventos** | Consultar y filtrar eventos ingresando presupuesto máximo, rango de disponibilidad horaria y zona geográfica. | Asistente | Consultar y Filtrar Eventos |
| **REQ-02** | **Gestión de eventos** | Crear, modificar y cancelar/eliminar eventos locales validando aforos, fechas y precios. | Organizador | Administrar Eventos |
| **REQ-13** | **Registro y creación de cuenta** | Crear cuenta de usuario, autenticación segura y emisión de tokens de sesión. | Usuario nuevo | Registrar / Autenticar Usuario |

### 2.2 Requerimientos de Fase Posterior (Preservados en el Backlog)
Los requerimientos fuera del alcance inicial **no fueron eliminados**, sino clasificados para las fases subsiguientes:
- **Should Have (Fase Posterior — Incrementos E3/E4):** `REQ-03` (Recomendaciones personalizadas), `REQ-06` (Fijado de eventos), `REQ-07` (Agendamiento de eventos en calendario), `REQ-08` (Marcado de asistencia), `REQ-09` (Conteo público de asistentes), `REQ-14` (Eventos destacados para invitados), `REQ-15` (Gestión de preferencias).
- **Could Have (Fase Posterior / Deseables — Incremento E4):** `REQ-04` (Notificación de recomendaciones), `REQ-05` (Calificación de eventos y organizadores), `REQ-10` (Recomendación entre usuarios), `REQ-11` (Gestión de amigos).
- **Won't Have (Pospuesto):** `REQ-12` (Notificación por alteración de eventos marcados).

---

## 3. Pendientes y Ambigüedades Detectadas para Próximas Iteraciones

Durante el proceso de auditoría técnica se identificaron los siguientes puntos para refinamiento en los Incrementos 1 y 2:

1. **Gestión de eventos que cruzan la medianoche (`REQ-01`):**  
   *Ambigüedad:* Cuando un usuario define un rango de búsqueda nocturno (e.g. 21:00 a 03:00) y un evento inicia a las 22:00 y finaliza a las 04:00, se requiere estandarizar si se evalúa por solapamiento parcial o contención total entre fechas consecutivas. Se resolverá en la suite de pruebas unitarias de `HorarioRango`.
2. **Política ante el límite de cuota de API Colombia (`REQ-01`):**  
   *Pendiente:* Definir el comportamiento del adaptador cuando `api-colombia.com` responda con error 429 (*Too Many Requests*) por superar el límite de 60 req/min por IP. Por ahora se trata como cualquier otra falla del proveedor externo (fallback con eventos locales).
3. **Persistencia del reporte de eventos falsos (`REQ-01` / Mitigación de Riesgo):**  
   *Pendiente:* Diseñar en el modelo relacional del Incremento 2 la tabla para almacenar reportes de anomalías o eventos sospechosos emitidos por los usuarios.

---

## 4. Declaración de Uso de Asistentes de IA (AI-Assisted Disclosure)


* **Herramientas utilizadas:** Asistentes basados en modelos LLM avanzados (DeepMind Antigravity / Gemini).
* **Partes del proyecto en que se usaron:** Auditoría de consistencia entre requerimientos, arquitectura y diseño detallado; estructuración de registros de decisión arquitectónica (ADRs 4, 5 y 6); modularización de diagramas Mermaid; y redacción de reflexiones técnicas.
* **Propósito:** Actuar como revisor técnico y auditor metodológico para garantizar la alineación estricta con las plantillas del curso (`Requirement_Template.md`, `Design_Deliverable_1_Template.md`) y las buenas prácticas enseñadas en clase.
* **Apropiación del equipo:** Todo el código, diagramas, supuestos, decisiones de diseño y análisis de trade-offs han sido revisados, comprendidos y validados por los integrantes del equipo *Power Rangers*, quienes asumen la autoría y responsabilidad intelectual para su sustentación y defensa individual.

---
