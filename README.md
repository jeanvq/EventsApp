# EventsApp

Aplicacion web para gestionar eventos y confirmaciones de asistencia (RSVP), construida con Angular y Angular Material.

## Tecnologias

- Angular 21
- Angular Material
- TypeScript
- RxJS

## Ejecutar en local

1. Instala dependencias:

```bash
npm install
```

2. Levanta el servidor de desarrollo:

```bash
npm start
```

3. Abre en el navegador:

```text
http://localhost:4200
```

## Pruebas

```bash
npm test
```

## Capturas

### Pantalla principal

![Pantalla principal](src/screenshots/home.png)

### Crear evento

![Formulario de creacion de evento](src/screenshots/create-event.png)

### RSVP

![Formulario RSVP](src/screenshots/rsvp.png)

## Estructura principal

- `src/app/components/event-list`: listado de eventos
- `src/app/components/create-event`: formulario de creacion
- `src/app/components/rsvp-form`: confirmacion de asistencia
- `src/app/services`: logica de negocio y datos
- `src/app/models`: modelos TypeScript
