# Documento de Necesidades del Sistema (Needs)

En este documento se detallan las necesidades de los usuarios y del negocio identificadas durante la fase de descubrimiento. Cada necesidad describe el problema o meta que se busca resolver, sirviendo como fundamento para la definición de los requerimientos funcionales del sistema.

---

## 1. Matriz de Trazabilidad (Necesidad vs. Requerimiento)

| ID Necesidad | Nombre de la Necesidad | Actor Principal | Requerimiento(s) Asociado(s) |
|---|---|---|---|
| **NEED-01** | Descubrimiento de eventos viables | Asistente a eventos | `REQ-01` |
| **NEED-02** | Exploración para usuarios invitados | Usuario no registrado | `REQ-14` |
| **NEED-03** | Personalización por intereses | Asistente a eventos | `REQ-03`, `REQ-15` |
| **NEED-04** | Planificación e itinerario personal | Asistente a eventos | `REQ-06`, `REQ-07`, `REQ-08` |
| **NEED-05** | Monitoreo de cambios e imprevistos | Asistente a eventos | `REQ-04`, `REQ-12` |
| **NEED-06** | Coordinación e interacción social | Asistente a eventos | `REQ-09`, `REQ-10`, `REQ-11` |
| **NEED-07** | Evaluación de reputación y confianza | Asistente a eventos | `REQ-05` |
| **NEED-08** | Gestión del catálogo de eventos | Organizador / Creador | `REQ-02` |
| **NEED-09** | Estimación de aforo y demanda | Organizador / Creador | `REQ-09` |

---

## 2. Especificación Detallada de Necesidades

### Categoría 1: Descubrimiento y Búsqueda

#### **[NEED-01] — Descubrimiento de eventos viables**
* **Actor:** Asistente a eventos.
* **Descripción:** El usuario necesita encontrar actividades acordes a su dinero disponible, tiempo libre y ubicación geográfica actual.
* **Justificación / Valor:** Evita la frustración de consultar opciones a las que no puede asistir por incompatibilidad de horario, costo elevado o distancia.
* **Requerimientos asociados:** `REQ-01`.

#### **[NEED-02] — Exploración para usuarios no registrados**
* **Actor:** Usuario invitado (sin cuenta).
* **Descripción:** El usuario no registrado necesita explorar rápidamente las mejores ofertas o eventos populares de la plataforma antes de decidir si crea una cuenta.
* **Justificación / Valor:** Reduce la barrera de entrada y fomenta el registro voluntario al mostrar el valor de la plataforma de inmediato.
* **Requerimientos asociados:** `REQ-14`.

#### **[NEED-03] — Personalización por intereses**
* **Actor:** Asistente a eventos.
* **Descripción:** El usuario necesita configurar y actualizar sus preferencias de entretenimiento para recibir sugerencias afines a sus gustos de forma automática.
* **Justificación / Valor:** Ahorra tiempo en búsquedas manuales y mejora la relevancia de la oferta mostrada.
* **Requerimientos asociados:** `REQ-03`, `REQ-15`.

---

### Categoría 2: Planificación y Seguimiento

#### **[NEED-04] — Planificación e itinerario personal**
* **Actor:** Asistente a eventos.
* **Descripción:** El usuario necesita guardar, agendar y estructurar un listado personal con las actividades a las que le interesa o planea asistir.
* **Justificación / Valor:** Permite al usuario organizar su agenda personal y evitar el olvido de eventos previamente seleccionados.
* **Requerimientos asociados:** `REQ-06`, `REQ-07`, `REQ-08`.

#### **[NEED-05] — Monitoreo de cambios e imprevistos**
* **Actor:** Asistente a eventos.
* **Descripción:** El usuario necesita recibir alertas automáticas cuando haya cambios significativos en un evento de su interés (modificación de horario, cambio de lugar o cancelación).
* **Justificación / Valor:** Evita desplazamientos innecesarios o malentendidos ante modificaciones de última hora.
* **Requerimientos asociados:** `REQ-04`, `REQ-12`.

---

### Categoría 3: Social y Comunidad

#### **[NEED-06] — Coordinación e interacción social**
* **Actor:** Asistente a eventos.
* **Descripción:** El usuario necesita compartir actividades con sus contactos, ver cuántas personas planean ir y conectar con amigos dentro de la plataforma.
* **Justificación / Valor:** Facilita la toma de decisiones grupal y promueve salidas compartidas entre amigos.
* **Requerimientos asociados:** `REQ-09`, `REQ-10`, `REQ-11`.

#### **[NEED-07] — Evaluación de reputación y confianza**
* **Actor:** Asistente a eventos.
* **Descripción:** El usuario necesita conocer las valoraciones y comentarios de otros asistentes sobre la calidad de un evento o la seriedad de un organizador.
* **Justificación / Valor:** Genera confianza en la comunidad y ayuda a tomar decisiones de compra informadas.
* **Requerimientos asociados:** `REQ-05`.

---

### Categoría 4: Administración y Gestión de Eventos

#### **[NEED-08] — Gestión del catálogo de eventos**
* **Actor:** Creador de eventos / Organizador.
* **Descripción:** El organizador necesita publicar, editar o eliminar información sobre sus actividades dentro de la plataforma de manera ágil.
* **Justificación / Valor:** Mantiene la información del catálogo actualizada y otorga autonomía de publicación al creador.
* **Requerimientos asociados:** `REQ-02`.

#### **[NEED-09] — Estimación de aforo y demanda**
* **Actor:** Creador de eventos / Organizador.
* **Descripción:** El organizador necesita proyectar el interés del público y el número aproximado de asistentes antes de la realización del evento.
* **Justificación / Valor:** Permite una mejor planificación logística (recinto, seguridad, insumos) según la convocatoria esperada.
* **Requerimientos asociados:** `REQ-09`.
