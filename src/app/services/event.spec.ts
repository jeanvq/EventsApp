import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { EventService } from './event';
import { Event } from '../models/event';

const baseEvent: Omit<Event, 'id'> = {
  title: 'Test Event',
  description: 'A test description',
  date: new Date('2027-06-01'),
  location: 'Test City',
  category: 'Technology',
  capacity: 50,
  organizer: 'Test Organizer',
  email: 'test@example.com',
};

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents()', () => {
    it('should return an observable array of events', async () => {
      const events = await firstValueFrom(service.getEvents());
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it('should return events with all required properties', async () => {
      const events = await firstValueFrom(service.getEvents());
      expect(events[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          location: expect.any(String),
          category: expect.any(String),
        })
      );
    });

    it('should include "Angular Workshop" in the initial data', async () => {
      const events = await firstValueFrom(service.getEvents());
      const found = events.find((e) => e.title === 'Angular Workshop');
      expect(found).toBeTruthy();
    });
  });

  describe('isTitleTaken()', () => {
    it('should return true for an existing title', async () => {
      const taken = await firstValueFrom(service.isTitleTaken('Angular Workshop'));
      expect(taken).toBe(true);
    });

    it('should return false for a non-existing title', async () => {
      const taken = await firstValueFrom(service.isTitleTaken('Nonexistent Event XYZ'));
      expect(taken).toBe(false);
    });

    it('should be case-insensitive', async () => {
      const taken = await firstValueFrom(service.isTitleTaken('angular workshop'));
      expect(taken).toBe(true);
    });
  });

  describe('addEvent()', () => {
    it('should add and return the event when no server error occurs', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Above 0.3 threshold → no error
      const added = await firstValueFrom(service.addEvent({ ...baseEvent, id: 0 }));
      expect(added.title).toBe('Test Event');
      expect(added.id).toBeGreaterThan(0);
      vi.restoreAllMocks();
    });

    it('should include the new event in subsequent getEvents() calls', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      await firstValueFrom(service.addEvent({ ...baseEvent, id: 0 }));
      const events = await firstValueFrom(service.getEvents());
      const found = events.find((e) => e.title === 'Test Event');
      expect(found).toBeTruthy();
      vi.restoreAllMocks();
    });

    it('should throw a server error when random threshold is met', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1); // Below 0.3 → error
      try {
        await firstValueFrom(service.addEvent({ ...baseEvent, id: 0 }));
        throw new Error('Test failed: expected an error to be thrown');
      } catch (err: any) {
        expect(err.message).toContain('Server error');
      }
      vi.restoreAllMocks();
    });
  });
});

