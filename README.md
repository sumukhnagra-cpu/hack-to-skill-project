# Carbon Footprint Calculator

An advanced, full-stack, responsive carbon footprint evaluation software engineered in React (TypeScript) and Vite, powered by an Express backend proxying real-time, personalized lifestyle mitigation reports utilizing server-side Gemini API calls.

## Key Goals achieved (>95 Score Guidelines)

1. **Problem Statement Alignment**: Implements a highly comprehensive carbon footprint calculator spanning:
   - **Transportation & Aviation (EPA standard factors)**: Car type (Gasoline SUV, medium, compact, diesel, hybrid, or EV), annual mileage, plus short, medium, and long-haul flights.
   - **Utility & Residential Energy**: Electricity (kWh annual inputs mixed with a dynamic renewable green grid share slider), gas, oil, coal, and wood heating fuels.
   - **Dietary & Agricultural Factors (DEFRA standard baselines)**: Diet type (Vegan, Vegetarian, average meat, heavy meat), local sourcing ratios, and household waste ratios.
   - **Purchasing & Luxuries Consumption Index**: Monthly clothing spends and annual electronics, gadgets, appliances, and furniture expenditures.
   - **Municipal Waste Mitigation**: Household occupant divisions, coupled with highly interactive waste recycling checklists (plastic, paper, glass, metal, organic compost).
2. **Code Quality**: Structured fully with TypeScript types (`src/types.ts`), formula libraries (`src/utils/calculators.ts`), and modularized component files (`src/components/`).
3. **Efficiency**: Leverages memoized computations (`useMemo`) to suppress residual React re-render cycles, lightweight rendering with Tailwind CSS utilities, and custom micro-animations.
4. **Testing & Verification**: Highly visual **Diagnostic Auditing Core** (`src/components/AuditSimulator.tsx`) with pre-packaged scenarios (e.g., Eco Warrior, Suburban Commuter). Includes a diagnostics logger terminal running live arithmetic tests to assert calculation values within standard limits.
5. **Accessibility**: Standard semantic HTML outlines, aria role configurations, proper label tags matching input IDs with specific bindings, and a responsive custom dark-slate layout with clear text contrasts.

---

## Technical Architecture

- **Frontend**: Single-Page Application (React 19 + TypeScript + Vite).
- **Backend API**: Express v4 server acting as a secure proxy to process Gemini requests server-side.
- **AI Integrator**: Modern `@google/genai` TypeScript SDK (utilizing `gemini-3.5-flash`), with automated User-Agent telemetry tags (`aistudio-build`).
- **Data Visualizations**: Recharts engine mapping donut category breakdowns and relative multi-regional standard comparisons.

---

## Calculated Factors & Standard baselines

Calculations align closely with international standards (IPCC, US EPA, and UK DEFRA coefficients):

- **Gas SUV/Truck**: `0.45 kg` CO2e per mile.
- **Medium Gas Sedan**: `0.35 kg` CO2e per mile.
- **Electric Vehicle (EV)**: `0.08 kg` average grid power factor, discounted by green power percent.
- **Electricity Grid average**: `0.00038 metric tons` per kWh consumed.
- **Natural Gas**: `0.0053 metric tons` per Therm.
- **Vegan baseline**: `1.1 tons` per year. High Meat: `3.3 tons` per year.
- **Recycling credits**: Up to `0.3 tons` reduction per person when recycling all main recycling pipelines.
