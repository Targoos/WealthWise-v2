# WealthWise

Aplicación web de finanzas personales que permite registrar ingresos y gastos, visualizar el balance general, el ahorro mensual y la evolución financiera a lo largo del tiempo.

![CI](https://github.com/TU_USUARIO/WealthWise-v2/actions/workflows/ci.yml/badge.svg)

## Funcionalidades

- Registro de transacciones con tipo (ingreso/gasto), monto, descripción y fecha
- Resumen financiero: balance total, ingresos del mes, gastos del mes y ahorro mensual
- Filtro del historial por mes
- Gráfico de barras con evolución de ingresos vs. gastos en los últimos 6 meses
- Validación de formulario con mensajes de error por campo
- Eliminación individual de transacciones
- Reset completo de datos con confirmación
- Persistencia local mediante `localStorage` — no requiere backend ni conexión a internet
- Diseño responsive (mobile, tablet y desktop)

## Stack tecnológico

| Herramienta                                   | Versión | Propósito                                  |
| --------------------------------------------- | ------- | ------------------------------------------ |
| [Vite](https://vitejs.dev/)                   | 5.x     | Bundler y servidor de desarrollo           |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Tipado estático estricto                   |
| [Chart.js](https://www.chartjs.org/)          | 4.x     | Gráfico de evolución mensual               |
| [Vitest](https://vitest.dev/)                 | 1.x     | Tests unitarios                            |
| [ESLint](https://eslint.org/)                 | 8.x     | Análisis estático del código               |
| [Prettier](https://prettier.io/)              | 3.x     | Formato consistente                        |
| CSS nativo                                    | —       | Variables, Grid, Flexbox, nomenclatura BEM |

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/WealthWise-v2.git
cd WealthWise-v2

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Compilar para producción
npm run build

# Vista previa del build de producción
npm run preview
```

## Tests

Los tests cubren las funciones puras de cálculo financiero (`finance.ts`) y la validación del formulario (`validators.ts`).

```bash
# Correr todos los tests una vez
npm test

# Modo watch (re-ejecuta al guardar)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

## Linting y formato

```bash
# Verificar errores de linting
npm run lint

# Corregir errores automáticamente
npm run lint:fix

# Aplicar formato con Prettier
npm run format
```

## Estructura del proyecto

```
WealthWise-v2/
├── index.html                  # Punto de entrada HTML
├── vite.config.ts              # Configuración de Vite
├── tsconfig.json               # Configuración de TypeScript (modo estricto)
├── .eslintrc.json              # Reglas de ESLint con plugin de TypeScript
├── .prettierrc.json            # Configuración de Prettier
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline de CI (lint → test → build)
└── src/
    ├── types.ts                # Interfaces y tipos compartidos
    ├── storage.ts              # Acceso a localStorage (lectura, escritura, borrado)
    ├── finance.ts              # Cálculos financieros (funciones puras)
    ├── validators.ts           # Validación de datos del formulario
    ├── ui.ts                   # Construcción y actualización del DOM
    ├── chart.ts                # Inicialización y actualización del gráfico
    ├── main.ts                 # Punto de entrada: inicialización y event listeners
    ├── styles.css              # Estilos globales con variables CSS
    └── tests/
        ├── finance.test.ts     # Tests de cálculos financieros
        └── validators.test.ts  # Tests de validación de formulario
```

## Arquitectura

La aplicación sigue una separación estricta de responsabilidades. Cada módulo tiene un único rol:

- **`types.ts`** — define las interfaces (`Transaction`, `Summary`, `ValidationResult`, etc.) que se comparten entre módulos. Ningún módulo define sus propios tipos locales.
- **`storage.ts`** — es el único punto de contacto con `localStorage`. El resto de la app no accede al storage directamente.
- **`finance.ts`** — contiene únicamente funciones puras que reciben arrays y devuelven números. No tienen efectos secundarios, lo que facilita testearlas de forma aislada.
- **`validators.ts`** — recibe los datos crudos del formulario (strings) y devuelve `{ valid, errors }`. No conoce el DOM.
- **`ui.ts`** — construye y actualiza nodos del DOM. No calcula ni persiste datos.
- **`chart.ts`** — encapsula toda la lógica de Chart.js. Solo expone `renderChart()`.
- **`main.ts`** — orquesta los módulos anteriores: escucha eventos, llama a validators, storage y finance, y pasa los resultados a ui y chart.

### Por qué sin framework de UI

El DOM se manipula con `createElement` y `appendChild` en lugar de usar un framework como React o Vue. Para una aplicación de este scope — sin estado compartido complejo ni renderizado condicional profundo — un framework agregaría overhead sin beneficios reales. El código resultante es más directo y no requiere conocer abstracciones adicionales para entenderlo.

### Por qué Chart.js con tree-shaking

Chart.js se importa de forma modular (`BarElement`, `BarController`, `CategoryScale`, etc.) en lugar de importar el bundle completo. Esto reduce el tamaño del build final incluyendo solo el código necesario para el gráfico de barras.

## CI/CD

El pipeline de GitHub Actions corre automáticamente en cada push a `main` o `develop` y en pull requests. Ejecuta tres pasos en orden: lint → test → build. Si alguno falla, los siguientes no se ejecutan.
