import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AppComponent } from './app';
import { routes } from './app.routes';
import { EventService } from './services/event';
import { Event } from './models/event';

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Angular Workshop',
    description: 'Learn Angular',
    date: new Date('2026-04-15'),
    location: 'Toronto',
    category: 'Technology',
    capacity: 50,
    organizer: 'John Doe',
    email: 'john@example.com',
  },
];

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        {
          provide: EventService,
          useValue: { getEvents: vi.fn().mockReturnValue(of(mockEvents)) },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have the title "Event Manager"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toBe('Event Manager');
  });
});

describe('App Routing (routed component tests)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        {
          provide: EventService,
          useValue: { getEvents: vi.fn().mockReturnValue(of(mockEvents)) },
        },
      ],
    });
  });

  it('should render the EventListComponent at /events', async () => {
    const harness = await RouterTestingHarness.create('/events');
    expect(harness.routeNativeElement).toBeTruthy();
    expect(harness.routeNativeElement!.querySelector('.list-container')).toBeTruthy();
  });

  it('should render the CreateEventComponent at /create', async () => {
    const harness = await RouterTestingHarness.create('/create');
    expect(harness.routeNativeElement).toBeTruthy();
  });

  it('should render the RsvpFormComponent at /rsvp', async () => {
    const harness = await RouterTestingHarness.create('/rsvp');
    expect(harness.routeNativeElement).toBeTruthy();
  });

  it('should redirect "/" to the events list', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.navigateByUrl('/events');
    expect(harness.routeNativeElement).toBeTruthy();
  });
});
