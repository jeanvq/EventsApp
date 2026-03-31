import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Angular Workshop',
      description: 'Learn Angular from scratch',
      date: new Date('2026-04-15'),
      location: 'Toronto',
      category: 'Technology',
      capacity: 50,
      organizer: 'John Doe',
      email: 'john@example.com'
    },
    {
      id: 2,
      title: 'Music Festival',
      description: 'A great outdoor music event',
      date: new Date('2026-05-20'),
      location: 'Waterloo',
      category: 'Music',
      capacity: 200,
      organizer: 'Jane Smith',
      email: 'jane@example.com'
    }
  ];

  // Simula obtener todos los eventos
  getEvents(): Observable<Event[]> {
    return of(this.events).pipe(delay(500));
  }

  // Simula agregar un evento
  addEvent(event: Event): Observable<Event> {
    const newEvent = { ...event, id: this.events.length + 1 };

    // Simula un error HTTP aleatorio (30% de las veces)
    if (Math.random() < 0.3) {
      return throwError(() => new Error('Server error: Could not save the event'));
    }

    this.events.push(newEvent);
    return of(newEvent).pipe(delay(500));
  }

  // Verifica si el título ya existe (para validación personalizada)
  isTitleTaken(title: string): Observable<boolean> {
    const taken = this.events.some(
      e => e.title.toLowerCase() === title.toLowerCase()
    );
    return of(taken).pipe(delay(300));
  }
}

