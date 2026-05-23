# MejorSet USA — Padel Court ROI Estimator

Dashboard interactivo para estimar el ROI de pistas de pádel **indoor** y **outdoor** en el mercado estadounidense.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 4**
- **Recharts** — gráficos de flujo de caja
- Motor de cálculo en `src/lib/estimator/`

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker compose up --build
```

## Funcionalidades

- Configuración de canchas indoor/outdoor con CAPEX benchmark MejorSet USA
- Tier de mercado US (Tier 1/2/3) con factor OPEX
- Ingresos: tarifa horaria, utilización, membresías, ingresos auxiliares
- Estacionalidad outdoor (factor 0.82 anual)
- OPEX mensual desglosado + financiación opcional
- KPIs: CAPEX, payback, ROI, NPV (10%), IRR
- Escenarios: conservador / base / optimista
- Gráficos de flujo anual y posición acumulada

## Estructura

```
src/
├── app/              # Páginas Next.js
├── components/       # UI y dashboard
└── lib/
    └── estimator/    # Motor ROI (engine, assumptions, types)
```

## Estado

Activo — MVP funcional.
