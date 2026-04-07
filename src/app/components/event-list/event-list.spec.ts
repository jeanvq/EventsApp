import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { vi } from 'vitest';

import { EventListComponent } from './event-list';
import { EventService } from '../../services/event';
import { Event } from '../../models/event';

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Angular Workshop',
    description: 'Learn Angular from scratch',
    date: new Date('2026-04-15'),
    location: 'Toronto',
    category: 'Technology',
    capacity: 50,
    organizer: 'John Doe',
    email: 'john@example.com',
  },
];

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let getEventsMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getEventsMock = vi.fn().mockReturnValue(of(mockEvents));
    const eventServiceStub = { getEvents: getEventsMock };

    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        { provide: EventService, useValue: eventServiceStub },
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading = true and no events', () => {
    // Before detectChanges, ngOnInit has not run
    expect(component.isLoading).toBe(true);
    expect(component.events.length).toBe(0);
  });

  it('should load events synchronously when service emits', () => {
    fixture.detectChanges(); // triggers ngOnInit -> loadEvents()
    // of(mockEvents) is synchronous, so data is available immediately
    expect(component.events.length).toBe(1);
    expect(component.events[0].title).toBe('Angular Workshop');
    expect(component.isLoading).toBe(false);
  });

  it('should set hasError and clear isLoading when service fails', () => {
    getEventsMock.mockReturnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();
    expect(component.hasError).toBe(true);
    expect(component.isLoading).toBe(false);
  });

  it('should call getEvents again when loadEvents() is invoked', () => {
    fixture.detectChanges();
    component.loadEvents();
    expect(getEventsMock).toHaveBeenCalledTimes(2);
  });

  it('should reset hasError when loadEvents() succeeds after a failure', () => {
    getEventsMock.mockReturnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.hasError).toBe(true);

    getEventsMock.mockReturnValue(of(mockEvents));
    component.loadEvents();
    expect(component.hasError).toBe(false);
  });
});
