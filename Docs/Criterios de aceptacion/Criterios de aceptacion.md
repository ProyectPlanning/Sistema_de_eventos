# Criterios de Aceptación

**AC.1.1 — eventos filtrado**:
Dado que el usuario se encuentra en la pantalla de búsqueda de actividades y existen eventos vigentes registrados en "Colombia", departamento "Bogotá D.C.", ciudad "Bogotá",
cuando ingresa como presupuesto máximo "$50.000 COP", selecciona la ciudad "Bogotá" y define un rango horario de "hoy a las 18:00 a 22:00",
entonces el sistema retorna y despliega la lista de eventos cuya ubicación coincida con "Bogotá", cuya tarifa mínima vigente sea menor o igual a $50.000 COP (conforme a BR-02), cuyo horario esté comprendido en el rango indicado y que tengan al menos 1 cupo disponible (conforme a BR-01).

**AC.1.2 — sin eventos compatibles**:
Dado que no existen eventos registrados en la ciudad "Medellín" con precio menor a "$10.000 COP" en el rango de "hoy a las 08:00 a 12:00",
cuando el usuario ejecuta la consulta con dichos filtros,
entonces el sistema informa claramente que no se encontraron eventos que satisfagan todos los criterios simultáneamente.

**AC.1.3 — eventos gratis**:
Dado que existen eventos vigentes de entrada libre ($0 COP) en la ciudad seleccionada dentro del rango horario del usuario,
cuando el usuario ejecuta la búsqueda ingresando un presupuesto máximo de "$0 COP",
entonces el sistema presenta exclusivamente los eventos gratuitos ($0 COP) que coincidan con la ubicación y el horario definidos.

**AC.1.4 — Búsqueda parcial y límite de resultados**:
Dado que existen 15 eventos vigentes registrados para la ciudad de "Cali",
cuando el usuario selecciona únicamente la ciudad "Cali" dejando vacíos los campos de presupuesto y rango de horario,
entonces el sistema aplica la regla BR-03 y retorna los 15 eventos correspondientes a dicha ciudad.


**AC.1.5 — Sin filtros**:
Dado que el catálogo contiene eventos vigentes y el usuario no especifica ningún criterio de filtrado,
cuando el usuario solicita ver actividades disponibles,
entonces el sistema aplica BR-03 y presenta un listado de eventos vigentes aleatorios.
