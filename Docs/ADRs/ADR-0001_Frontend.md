# ADR-0001: Usar React, TypeScript, vite y Tailwind CSS para el frontend
<!-- docs/adr/0001-usar-react-typescript-tanstack-query-zustand-tailwind.md -->

## Autores:

- Justin David Vargas Vasquez
- Cristian Andrés Díaz Ortega

## Contexto
La plataforma debe permitir a los usuarios descubrir, filtrar y reservar actividades personalizadas según tiempo, ubicación, intereses y disponibilidad. El flujo incluye formularios complejos
(fechas, horarios, número de personas, preferencias), listados dinámicos de actividades y estados transaccionales (disponibilidad, confirmación, pago). El equipo no conoce la mayoría de las
tecnologías del stack, por lo que la curva de aprendizaje es una fuerza restrictiva. Adicionalmente, el producto está en fase de definición, lo que exige velocidad de iteración y bajo costo de
pivote. React es un requisito explícito del proyecto.

## Decisión
Vamos a construir el frontend con React 19,TypeScript y Vite, además de Tailwind CSS para los estilos.

## Alternativas consideradas

- Next.js (React + SSR/SSG): Se descarta por ahora. Ofrece mejor SEO y renderizado del servidor, deseable para descubrimiento orgánico de actividades, pero añade complejidad (rutas, servidor, despliegue)
que el equipo no está preparado para absorber en el MVP. La migración futura es viable porque el núcleo React se mantiene.

- Vue.js / Nuxt: Curva de aprendizaje comparable a React, pero el equipo ya tiene React como requisito explícito y la demanda de mercado de React es mayor.

- Angular: Mayor estructura, pero curva de aprendizaje pronunciada y más verboso; no se alinea con la velocidad requerida para el MVP.

- CSS Modules / styled-components en lugar de Tailwind: Se descartan por velocidad de iteración; Tailwind reduce el cambio de contexto entre HTML y CSS.

## Consecuencias

### Positivas:

- Un solo lenguaje (TypeScript) en frontend y backend, reduciendo la carga cognitiva del equipo.

- Vite acelera el ciclo de desarrollo con HMR casi instantáneo.
  
- Ecosistema maduro para flujos interactivos (React): Facilita la integración de librerías especializadas para el MVP, como selectores de fechas, mapas interactivos, sliders de rango de precios y manejo eficiente de formularios complejos (ej. React Hook Form).
- Seguridad en el manejo de datos transaccionales (TypeScript): Previene errores en tiempo de ejecución al manipular estructuras de datos complejas (combinación de filtros de presupuesto, horarios, ubicaciones y estados de pago).

  
### Negativas / costos aceptados:

- Pérdida de SEO: sin SSR, las páginas de actividades no se renderizan en el servidor. Se acepta como deuda consciente; si el SEO orgánico se vuelve crítico, se evaluará migrar a Next.js
  
- Tailwind: HTML denso y dependencia de disciplina para mantener un sistema de diseño coherente.
  
- Fricción por la curva de aprendizaje (TypeScript): Para un equipo nuevo en el stack, aprender las reglas de tipado estricto puede ralentizar la velocidad inicial de prototipado durante las primeras semanas.
