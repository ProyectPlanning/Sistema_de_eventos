# Arquitectura de Software de 3 Capas (Monolito Modular)

Esta arquitectura está diseñada bajo el patrón de monolito modular, donde la lógica de negocio (Back-End) se divide en módulos independientes.
A continuación, se detallan los componentes de cada capa.

## 1. Componentes de la Arquitectura

### 1.1. Capa de Presentación (Front-End)
*   **Aplicación Web:** Interfaz de usuario final. Es la encargada de renderizar la vista, capturar las interacciones del usuario y comunicarse exclusivamente con el API Gateway del Back-End mediante peticiones HTTP/REST().

### 1.2. Capa de Lógica de Negocio (Back-End)
Es el núcleo del sistema. Aquí residen los módulos que contienen las reglas de negocio.
*   **API Gateway:** Punto de entrada único al Back-End. Se encarga de enrutar las peticiones provenientes del Front-End hacia los módulos correspondientes,
  además de gestionar la seguridad, autenticación y validación inicial de las solicitudes.
*   **Usuarios y Perfiles:** *(Antes "Usuarios")* Gestiona todo lo relacionado con la identidad en el sistema: registro, inicio de sesión, roles,
  permisos y datos del perfil del usuario(Postdata: Un usuario  se le asigna uno/varios un perfiles para saber qué alcance tiene.).
*   **Gestión de Eventos:** *(Antes "EVENTOS")* Contiene la lógica de negocio principal para la creación, edición, cancelación y consulta de eventos. 
*   **Módulo de Notificaciones:** *(Antes "notificaciones")* Se encarga de generar y gestionar las alertas dirigidas al usuario (ej. confirmaciones, recordatorios).
*   **Capa de Persistencia:** *(Antes "Capa de Persistencia (BD)")* Actúa como intermediario entre los módulos de negocio y la base de datos física.
  Implementa el patrón DAO (Data Access Object) para abstraer las consultas SQL y evitar que la lógica de negocio dependa directamente del motor de base de datos.

### 1.3. Capa de Datos (Persistencia)
*   **Base de Datos:** Es el almacenamiento físico y centralizado de la información. Recibe las consultas exclusivamente de la Capa de Persistencia del Back-End.

### 1.4. Servicios de Terceros (Sistemas Externos)
APIs externas fuera del dominio de nuestro sistema. 
*   **API de Eventos:** Servicio externo para sincronización o consulta de eventos de terceros.
*   **API de Google Maps:** Servicio externo para geolocalización, mapas o cálculo de rutas.
*   **API de Gmail:** Servicio externo para el envío de correos electrónicos.
