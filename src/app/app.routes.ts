import { Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list';
import { CreateEventComponent } from './components/create-event/create-event';
import { RsvpFormComponent } from './components/rsvp-form/rsvp-form';

export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', component: EventListComponent },
  { path: 'create', component: CreateEventComponent },
  { path: 'rsvp', component: RsvpFormComponent }
];