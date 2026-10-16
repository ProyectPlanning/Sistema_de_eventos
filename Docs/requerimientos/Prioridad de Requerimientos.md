# Priorización de Requerimientos Funcionales (Metodología MoSCoW)

En este documento hemos aplicado la metodología de priorización **MoSCoW** a los requerimientos funcionales. Este análisis nos ha permitido identificar los requerimientos críticos para el Producto Mínimo Viable (MVP) y organizar el resto de las funcionalidades según su impacto y viabilidad.

A continuación, se presenta la clasificación de los requerimientos:

---

## 1. Must Have (Debe tener / Esenciales)
Estos requerimientos son obligatorios y representan el núcleo de nuestro sistema. Sin ellos, el producto carece de valor o no puede funcionar. Fueron seleccionados como la prioridad máxima del proyecto.

### Tabla Resumen - Requerimientos Esenciales

| ID | Nombre / Función | Descripción Breve |
| :--- | :--- | :--- |
| **REQ-13** | Registro de cuenta | Permitir a nuevos usuarios crear una cuenta en la plataforma. |
| **REQ-02** | Gestión de eventos | Crear, modificar y eliminar eventos en el sistema. |
| **REQ-01** | Filtrado de eventos | Filtrar eventos por presupuesto, horario y localización geográfica. |
| **REQ-03** | Recomendaciones por preferencias | Generar recomendaciones de eventos basadas en los gustos del usuario. |
| **REQ-07** | Agendamiento de eventos | Permitir al usuario agendar eventos directamente. |
| **REQ-08** | Marcado de asistencia | Marcar eventos a los que se planea asistir y consultarlos. |

### Detalle de Requerimientos Esenciales

*   **REQ-13: Registro y creación de cuenta:** El sistema debe permitir al usuario crear una cuenta ingresando la información requerida para su registro. Es el paso inicial indispensable para personalizar la experiencia.
*   **REQ-02: Administración de eventos:** El sistema debe permitir a los usuarios autorizados crear, modificar y eliminar eventos dentro de la plataforma. Sin eventos, el sistema no tiene contenido.
*   **REQ-01: Búsqueda y filtrado de eventos:** El sistema debe permitir al usuario consultar y filtrar eventos ingresando su presupuesto máximo, su rango de disponibilidad horaria y su zona geográfica (país, departamento/estado y ciudad).
*   **REQ-03: Motor de recomendaciones personalizadas:** El sistema debe recomendar automáticamente eventos al usuario basándose en sus preferencias, aportando el valor diferencial de la aplicación.
*   **REQ-07: Agendamiento de eventos:** El sistema debe permitir al usuario agendar un evento en su calendario personal o en la agenda de la plataforma cuando el evento sea agendable.
*   **REQ-08: Confirmación de interés y asistencia:** El sistema debe permitir al usuario marcar los eventos a los que tiene intención de asistir, así como visualizar la lista completa de eventos marcados.

---

## 2. Should Have (Debería tener / Importantes)
Funcionalidades de alta prioridad que son importantes para una experiencia completa, pero que no son estrictamente necesarias para el lanzamiento de la primera versión.

*   **REQ-15:** Gestión de preferencias.
*   **REQ-06:** Fijado de eventos.
*   **REQ-09:** Conteo de asistentes (indicador público).
*   **REQ-14:** Vista pública de eventos destacados (para invitados).

## 3. Could Have (Podría tener / Deseables)
Requerimientos que mejoran la experiencia del usuario (nice-to-have), pero cuyo impacto es menor si se omiten temporalmente. Se implementarán si el tiempo y los recursos lo permiten.

*   **REQ-05:** Calificación de eventos y organizadores.
*   **REQ-11:** Gestión de lista de amigos.
*   **REQ-10:** Recomendación directa entre usuarios.
*   **REQ-04:** Notificación de recomendaciones.

## 4. Won't Have (No tendrá por ahora / Pospuestos)
Requerimientos que han sido acordados como fuera del alcance para esta fase del proyecto, pero que podrían ser considerados para versiones futuras.

*   **REQ-12:** Notificación por alteración de eventos marcados (Cancelaciones o modificaciones).
