# Criterios de Aceptación

**AC.1.1 — eventos filtrado**:
Dado que el usuario se encuentra en la pantalla de búsqueda de actividades
cuando ingresa como presupuesto máximo "$50.000 pesos", selecciona el país "Colombia" y define un rango de disponibilidad de "18:00 a 22:00"
Entonces el sistema muestra la lista de eventos cuya ubicación sea Colombia, su tarifa mínima sea menor o igual a $50.000 pesos y su horario de inicio y fin esté totalmente contenido entre las 18:00 y las 22:00

**AC.1.2 — sin eventos compatibles**:
Dado que no existen eventos registrados en la ciudad "Medellín" con precio menor a "$10.000 pesos" dentro del rango de "08:00 a 12:00"
cuando el usuario ejecuta una búsqueda en Medellín con presupuesto máximo de "$10.000 pesos" y rango de disponibilidad de "08:00 a 12:00"
entonces el sistema muestra un mensaje indicando que no se encontraron actividades con esos criterios y sugiere ampliar el rango horaria o ajustar el presupuesto


**AC.1.3 — eventos gratis**:
Dado que existen eventos públicos de entrada libre ($0 pesos) en la ciudad seleccionada durante el rango de disponibilidad del usuario
cuando el usuario realiza la búsqueda ingresando un presupuesto máximo de "$0 pesos"
entonces el sistema retorna únicamente los eventos con tarifa de acceso de $0 pesos que coincidan con la ciudad y el rango de horario especificados

**AC.1.4 — Búsqueda parcial y límite de resultados**:
Dado que existen 15 eventos registrados en la ciudad "Bogotá"
cuando el usuario realiza una búsqueda seleccionando únicamente la ciudad "Bogotá" sin ingresar presupuesto ni rango horario
entonces el sistema muestra los 15 eventos.


**AC.1.5 — Sin filtros**:
Dado que el usuario no ingresa ningún filtro
cuando el usuario ejecuta la búsqueda
entonces el sistema muestra eventos aleatorios.
