# EventsApp — Event Manager

A web application for creating and managing events with RSVP functionality, built with **Angular 21** and **Angular Material**.

---

## 1. Which App I Selected and Why

**EventsApp** — an event creation and RSVP management tool.

This project was selected because it exercises a wide range of Angular features in a realistic, end-to-end scenario:

- **Reactive forms** with built-in validators and a custom `futureDateValidator`
- **Template-driven forms** (RSVP form) to contrast with reactive forms
- **A service layer** that simulates HTTP responses with RxJS `delay()` and error handling
- **Component-based architecture** with three distinct view components
- **Client-side routing** with Angular Router

This breadth made it an ideal candidate for demonstrating unit testing strategies, performance optimizations, and a production-ready build pipeline.

---

## 2. What Tests I Wrote and How to Run Them

Tests are written with **Vitest** (Angular 21's built-in test runner) and Angular's `TestBed` utilities. A total of **54 tests** are distributed across 6 spec files.

### Test Inventory

| Spec file | Tests | What is covered |
|---|---|---|
| `services/event.spec.ts` | 10 | `getEvents()`, `isTitleTaken()` (case-insensitive duplicate check), `addEvent()` success path, `addEvent()` server-error path |
| `components/event-list/event-list.spec.ts` | 6 | Component creation, loading state, synchronous data render, error state display, `loadEvents()` retry, error recovery |
| `components/create-event/create-event.spec.ts` | 15 | Form is invalid on init, every field validator (`required`, `minLength`, `maxLength`, `email`, custom `futureDateValidator`, capacity range), submit triggers service, router navigates on success |
| `components/rsvp-form/rsvp-form.spec.ts` | 8 | Default field values, invalid-form guard, `isSubmitting` flag during 1-second delay (via `vi.useFakeTimers()`), `submitted` state after delay, form reset |
| `pipes/truncate.pipe.spec.ts` | 9 | Text truncated at limit, equal-to-limit passes through unchanged, custom ellipsis character, empty / null / undefined input |
| `app.spec.ts` | 6 | App component creation, `title` property, routed views for `/events`, `/create`, `/rsvp` rendered via `RouterTestingHarness`, redirect from `/` |

### How to Run

```bash
# Run all tests once
npm test

# Run in watch mode (re-runs on file save)
npx ng test

# Run once with verbose output
npx ng test --watch=false
```

All 54 tests should pass with exit code 0.

---

## 3. What Optimization Steps I Took

### 3.1 Lazy-loaded routes

Before this change every component was bundled into a single initial chunk. Each route now uses `loadComponent` so its bundle is only downloaded when the user navigates there:

```typescript
// src/app/app.routes.ts
{ path: 'events',
  loadComponent: () => import('./components/event-list/event-list').then(m => m.EventListComponent) },
{ path: 'create',
  loadComponent: () => import('./components/create-event/create-event').then(m => m.CreateEventComponent) },
{ path: 'rsvp',
  loadComponent: () => import('./components/rsvp-form/rsvp-form').then(m => m.RsvpFormComponent) },
```

**Result — three separate lazy chunks are now only loaded on demand:**

| Chunk | Size (raw) | Transferred |
|---|---|---|
| `event-list` | ~44 kB | ~15 kB |
| `create-event` | ~57 kB | ~21 kB |
| `rsvp-form` | ~65 kB | ~24 kB |
| **Initial bundle** | **~452 kB** | **~117 kB** |

### 3.2 `TruncatePipe` — keep the DOM lean

A reusable `TruncatePipe` (`src/app/pipes/truncate.pipe.ts`) was added and applied to event card descriptions. Long strings are capped at 120 characters before they ever reach the DOM, preventing layout thrashing and excessive text nodes.

### 3.3 `provideAnimationsAsync`

Angular Material animations are registered with `provideAnimationsAsync()` so the animation module is loaded in a separate async chunk and does not block the initial render.

### 3.4 Production build

The app is built with Angular's Esbuild-based build system, which includes automatic tree-shaking, dead-code elimination, minification, and output-file hashing for long-term caching:

```bash
npx ng build --configuration production
# Output → dist/events-app/browser/
```

---

## Screenshots

### Home screen
![Home screen](src/screenshots/home.png)

### Create event
![Create event form](src/screenshots/create-event.png)

### RSVP
![RSVP form](src/screenshots/rsvp.png)

---

## Technologies

- Angular 21 (standalone components)
- Angular Material
- TypeScript / RxJS
- Vitest (test runner)

## Run Locally

```bash
npm install
npm start
# Open http://localhost:4200
```

## Project Structure

```
src/app/
├── components/
│   ├── event-list/        # events listing view
│   ├── create-event/      # reactive form to create events
│   └── rsvp-form/         # template-driven RSVP form
├── pipes/
│   └── truncate.pipe.ts   # reusable description truncation pipe
├── services/
│   └── event.ts           # data layer (RxJS-based)
└── models/
    └── event.ts           # TypeScript model
```
