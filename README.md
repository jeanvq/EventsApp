# EventsApp — Event Manager

A web application for creating and managing events with RSVP functionality, built with **Angular 21** and **Angular Material**.

## Why this app?

This project was chosen because it covers a realistic range of Angular features: reactive forms with custom validators, template-driven forms, a service layer with simulated HTTP responses, component-based architecture, and client-side routing. This made it an ideal candidate for demonstrating unit testing, performance optimizations, and a production-ready build.

---

## Technologies

- Angular 21 (standalone components)
- Angular Material
- TypeScript
- RxJS
- Vitest (test runner)

---

## Run Locally

```bash
npm install
npm start
# Open http://localhost:4200
```

---

## Unit Tests

Tests are written with **Vitest** (Angular 21's default test runner) and Angular's `TestBed` utilities.

### What was tested

| File | Coverage highlights |
|---|---|
| `event.spec.ts` | `getEvents()`, `isTitleTaken()` (case-insensitive), `addEvent()` (success + error path) |
| `event-list.spec.ts` | Component creation, sync data loading, error state, `loadEvents()` retry |
| `create-event.spec.ts` | Form initialization, all field validators (required, minLength, maxLength, email, custom `futureDateValidator`, capacity range), submit calls service, navigate on success |
| `rsvp-form.spec.ts` | Default values, invalid-form guard, async submit delay via `vi.useFakeTimers()`, reset |
| `truncate.pipe.spec.ts` | Truncation at limit, equal-to-limit pass-through, custom ellipsis, empty/null/undefined input |
| `app.spec.ts` | App component title, routed components for `/events`, `/create`, `/rsvp` via `RouterTestingHarness` |

### How to run

```bash
npm test
# or: npx ng test --watch=false
```

---

## Optimization Steps

### 1. Lazy-loaded routes (`app.routes.ts`)

Each route uses `loadComponent` so the component bundle is only downloaded when the user navigates to that route:

```typescript
{
  path: 'events',
  loadComponent: () => import('./components/event-list/event-list').then(m => m.EventListComponent)
}
```

**Result:** Three separate lazy chunks in the production build (`event-list`, `create-event`, `rsvp-form`), reducing the initial payload from a single large bundle to ~118 kB transferred on first load.

### 2. `TruncatePipe` for long descriptions

A reusable `TruncatePipe` was added (`src/app/pipes/truncate.pipe.ts`) and applied to event card descriptions, keeping the DOM lean and preventing layout issues with long text.

### 3. Production build with full tree-shaking and minification

```bash
npx ng build --configuration production
```

Angular's Esbuild-based builder performs tree-shaking, minification, and output hashing automatically.

**Production bundle summary:**

| Type | Raw | Transferred |
|---|---|---|
| Initial JS + CSS | ~452 kB | ~117 kB |
| Lazy chunks (3 routes) | ~386 kB | ~73 kB |

### 4. `provideAnimationsAsync` (already in place)

Animations are loaded asynchronously so they do not block the initial render.

---

## Screenshots

### Home screen

![Home screen](src/screenshots/home.png)

### Create event

![Create event form](src/screenshots/create-event.png)

### RSVP

![RSVP form](src/screenshots/rsvp.png)


## Main Structure

- `src/app/components/event-list`: event listing
- `src/app/components/create-event`: event creation form
- `src/app/components/rsvp-form`: RSVP confirmation form
- `src/app/services`: business logic and data layer
- `src/app/models`: TypeScript models
