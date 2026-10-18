# Especificación de Requerimientos Funcionales

**Proyecto:** Plataforma de Descubrimiento y Gestión de Eventos ("Power Rangers")  
**Curso:** Ingeniería de Software I · 2026-II · Universidad Nacional de Colombia  

Este documento compila el catálogo integral de requerimientos funcionales del sistema (`REQ-01` a `REQ-15`), identificando con rigor aquellos que conforman el alcance de la **Primera Etapa (Incremento 1 / MVP)** y aquellos programados para **Fases Posteriores**, conforme a la priorización MoSCoW acordada.

---

## 1. Tabla Resumen de Requerimientos y Alcance por Etapas

| ID | Nombre / Función | Descripción Breve | Alcance / Etapa | Prioridad MoSCoW |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-01** | **Búsqueda y filtrado de eventos** | Filtrar eventos por presupuesto máximo, disponibilidad horaria y ubicación geográfica. | **Primera Etapa (MVP)** | **Must Have** |
| **REQ-02** | **Gestión de eventos** | Crear, modificar y eliminar eventos locales en el sistema. | **Primera Etapa (MVP)** | **Must Have** |
| **REQ-13** | **Registro y creación de cuenta** | Permitir a los usuarios crear una cuenta y autenticarse en la plataforma. | **Primera Etapa (MVP)** | **Must Have** |
| **REQ-03** | Recomendaciones por preferencias | Sugerir automáticamente actividades basadas en gustos del usuario. | *Fase Posterior* | Should Have |
| **REQ-04** | Notificación de recomendaciones | Enviar alertas sobre nuevos eventos recomendados. | *Fase Posterior* | Could Have |
| **REQ-05** | Calificación de eventos y creadores | Calificar la experiencia de eventos y la reputación del organizador. | *Fase Posterior* | Could Have |
| **REQ-06** | Fijado de eventos | Fijar actividades y consultar la lista de eventos destacados guardados. | *Fase Posterior* | Should Have |
| **REQ-07** | Agendamiento de eventos | Agendar actividades directamente en calendarios personales. | *Fase Posterior* | Should Have |
| **REQ-08** | Marcado de asistencia | Marcar intención de asistencia y consultar el itinerario planificado. | *Fase Posterior* | Should Have |
| **REQ-09** | Conteo de asistentes | Desplegar indicador público de aforo proyectado e interés. | *Fase Posterior* | Should Have |
| **REQ-10** | Recomendación entre usuarios | Compartir y sugerir eventos directamente entre contactos. | *Fase Posterior* | Could Have |
| **REQ-11** | Gestión de amigos | Agregar y administrar una lista de contactos dentro de la plataforma. | *Fase Posterior* | Could Have |
| **REQ-12** | Notificación de cambios en eventos | Alertar a los asistentes sobre cambios de horario, recinto o cancelación. | *Fase Posterior* | Won't Have (por ahora) |
| **REQ-14** | Eventos destacados para invitados | Visualización pública de actividades destacadas sin iniciar sesión. | *Fase Posterior* | Should Have |
| **REQ-15** | Gestión de preferencias | Configurar y editar las preferencias e intereses del usuario. | *Fase Posterior* | Should Have |

---

## 2. Detalle de Requerimientos — Primera Etapa (Alcance Inmediato)

### 2.1. Gestión e Interacción con Eventos

#### **[REQ-01] — Búsqueda y filtrado de eventos**
* **Alcance:** Primera Etapa (Must Have).
* **Descripción:** El sistema debe permitir al usuario consultar y filtrar eventos ingresando su presupuesto máximo, su rango de disponibilidad horaria y su zona geográfica (país, departamento/estado y ciudad).
* **Especificación detallada:** Ver documento normativo individual [`REQ-01.md`](REQ-01.md).

#### **[REQ-02] — Administración de eventos**
* **Alcance:** Primera Etapa (Must Have).
* **Descripción:** El sistema debe permitir a los usuarios autorizados (organizadores) crear, modificar y eliminar eventos dentro de la plataforma, validando la coherencia de datos de horario, tarifas y capacidad.

### 2.2. Gestión de Identidad y Accesos

#### **[REQ-13] — Registro y creación de cuenta**
* **Alcance:** Primera Etapa (Must Have).
* **Descripción:** El sistema debe permitir a nuevos usuarios registrarse en la plataforma ingresando sus datos básicos de identificación, correo electrónico y contraseña segura, así como autenticarse para acceder a las funciones del sistema.

---

## 3. Detalle de Requerimientos — Fases Posteriores (Fuera de Alcance Inicial)

*(Se preservan las especificaciones para trazabilidad y evolución en los Incrementos 2 a 5).*

### 3.1. Gestión de Usuarios y Comunidad (Fase Posterior)
* **REQ-14: Vista pública de eventos destacados:** Mostrar listados de eventos populares a visitantes no autenticados para fomentar el registro.
* **REQ-15: Configuración de preferencias:** Permitir al usuario seleccionar y modificar sus categorías de interés desde su perfil.
* **REQ-11: Gestión de lista de amigos:** Buscar, agregar y gestionar contactos dentro de la aplicación.
* **REQ-10: Recomendación directa entre usuarios:** Compartir eventos específicos con contactos de la plataforma.

### 3.2. Interacción Avanzada y Planificación (Fase Posterior)
* **REQ-06: Fijado de eventos:** Guardar eventos en una lista personal de seguimiento rápido.
* **REQ-07: Agendamiento de eventos:** Sincronizar eventos con calendarios personales del usuario.
* **REQ-08: Confirmación de interés y asistencia:** Marcar públicamente intención de acudir y gestionar itinerario.
* **REQ-09: Indicador de concurrencia:** Desplegar en tiempo real el conteo de personas interesadas.
* **REQ-05: Calificación de eventos y organizadores:** Valoración comunitaria mediante puntuación (1 a 5 estrellas) y reseñas.

### 3.3. Recomendaciones y Notificaciones (Fase Posterior)
* **REQ-03: Motor de recomendaciones personalizadas:** Sugerencia automática de actividades cruzando preferencias del usuario con el catálogo.
* **REQ-04: Notificación de eventos recomendados:** Alertas push o correo ante nuevos eventos afines al perfil.
* **REQ-12: Notificación por alteración de eventos marcados:** Alertas ante reprogramaciones o cancelaciones de eventos marcados.
