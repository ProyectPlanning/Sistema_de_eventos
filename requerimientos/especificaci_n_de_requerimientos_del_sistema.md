# Especificación de Requerimientos Funcionales

En este documento se detallan los requerimientos funcionales del sistema, organizados e identificados mediante un código único para su trazabilidad y gestión.

---

## Tabla Resumen de Requerimientos

| ID | Nombre / Función | Descripción Breve |
| :--- | :--- | :--- |
| **REQ-01** | Filtrado de eventos | Filtrar eventos por presupuesto, horario y localización geográfica. |
| **REQ-02** | Gestión de eventos | Crear, modificar y eliminar eventos en el sistema. |
| **REQ-03** | Recomendaciones por preferencias | Generar recomendaciones de eventos basadas en los gustos del usuario. |
| **REQ-04** | Notificación de recomendaciones | Enviar notificaciones al usuario con eventos recomendados. |
| **REQ-05** | Calificación de eventos y creadores | Permitir calificar tanto al evento como al usuario que lo creó. |
| **REQ-06** | Fijado de eventos | Permitir fijar eventos y visualizar la lista de eventos fijados. |
| **REQ-07** | Agendamiento de eventos | Permitir al usuario agendar eventos directamente. |
| **REQ-08** | Marcado de asistencia | Marcar eventos a los que se planea asistir y consultarlos. |
| **REQ-09** | Conteo de asistentes | Mostrar la cantidad de personas que planean asistir a un evento. |
| **REQ-10** | Recomendación entre usuarios | Permitir recomendar eventos a otros usuarios del sistema. |
| **REQ-11** | Gestión de amigos | Permitir agregar y guardar otros usuarios como amigos. |
| **REQ-12** | Notificación de cambios en eventos | Notificar modificaciones o cancelaciones en eventos marcados para asistir. |
| **REQ-13** | Registro de cuenta | Permitir a nuevos usuarios crear una cuenta en la plataforma. |
| **REQ-14** | Eventos populares para invitados | Mostrar la lista de eventos mejor puntuados a usuarios no registrados. |
| **REQ-15** | Gestión de preferencias | Elegir y modificar las preferencias de usuario en cualquier momento. |

---

## Detalle de Requerimientos

### 1. Gestión de Usuarios y Cuentas

#### **REQ-13: Registro y creación de cuenta**
* **Descripción:** El sistema debe permitir al usuario crear una cuenta ingresando la información requerida para su registro.

#### **REQ-14: Vista pública de eventos destacados**
* **Descripción:** Si el usuario no tiene una cuenta o no ha iniciado sesión, el sistema debe mostrar una lista con los eventos mejor puntuados por la comunidad.

#### **REQ-15: Configuración de preferencias**
* **Descripción:** El sistema debe permitir al usuario seleccionar sus preferencias de interés y modificarlas en cualquier momento desde su perfil.

#### **REQ-11: Gestión de lista de amigos**
* **Descripción:** El sistema debe permitir al usuario buscar y agregar a otros usuarios a una lista de amigos/contactos.

---

### 2. Gestión e Interacción con Eventos

#### **REQ-01: Búsqueda y filtrado de eventos**
* **Descripción:** El sistema debe permitir al usuario consultar y filtrar eventos por presupuesto, rango horario y ciudad.

#### **REQ-02: Administración de eventos**
* **Descripción:** El sistema debe permitir a los usuarios autorizados crear, modificar y eliminar eventos dentro de la plataforma.

#### **REQ-06: Fijado de eventos**
* **Descripción:** El sistema debe permitir al usuario fijar eventos de su interés y acceder a una sección dedicada para visualizar todos los eventos fijados.

#### **REQ-07: Agendamiento de eventos**
* **Descripción:** El sistema debe permitir al usuario agendar un evento en su calendario personal o en la agenda de la plataforma cuando el evento sea agendable.

#### **REQ-08: Confirmación de interés y asistencia**
* **Descripción:** El sistema debe permitir al usuario marcar los eventos a los que tiene intención de asistir, así como visualizar la lista completa de eventos marcados.

#### **REQ-09: Indicador de concurrencia**
* **Descripción:** El sistema debe mostrar públicamente en la ficha de cada evento el número total de personas que planean asistir.

---

### 3. Sistema de Recomendaciones y Notificaciones

#### **REQ-03: Motor de recomendaciones personalizadas**
* **Descripción:** El sistema debe recomendar automáticamente eventos al usuario basándose en sus preferencias.

#### **REQ-04: Notificación de eventos recomendados**
* **Descripción:** El sistema debe enviar notificaciones al usuario sobre la creación nuevos eventos recomendados para él.

#### **REQ-10: Recomendación directa entre usuarios**
* **Descripción:** El sistema debe permitir a un usuario compartir y recomendar eventos específicos directamente a otros usuarios.

#### **REQ-12: Notificación por alteración de eventos marcados**
* **Descripción:** El sistema debe notificar a los usuarios si un evento que habían marcado para asistir sufre modificaciones en su información o es eliminado.

---

### 4. Calificaciones y Valoraciones

#### **REQ-05: Calificación de eventos y organizadores**
* **Descripción:** El sistema debe permitir a los usuarios evaluar y calificar tanto la experiencia de un evento finalizado si el evento es calificable como al usuario/organizador que lo creó.
