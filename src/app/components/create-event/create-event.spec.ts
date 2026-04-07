import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CreateEventComponent } from './create-event';
import { EventService } from '../../services/event';
import { Event } from '../../models/event';

const validFormValue = {
  title: 'Great Conference',
  description: 'An amazing conference about technology',
  date: new Date('2027-06-01'),
  location: 'Toronto',
  category: 'Technology',
  capacity: 100,
  organizer: 'Jane Doe',
  email: 'jane@example.com',
};

const mockEvent: Event = { ...validFormValue, id: 3 };

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;
  let addEventMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    addEventMock = vi.fn().mockReturnValue(of(mockEvent));
    const eventServiceStub = { addEvent: addEventMock };

    await TestBed.configureTestingModule({
      imports: [CreateEventComponent],
      providers: [
        { provide: EventService, useValue: eventServiceStub },
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.eventForm.valid).toBe(false);
  });

  it('should mark all fields as touched when submitting an invalid form', () => {
    component.onSubmit();
    expect(component.eventForm.touched).toBe(true);
  });

  it('should not call addEvent when form is invalid', () => {
    component.onSubmit();
    expect(addEventMock).not.toHaveBeenCalled();
  });

  describe('Field validation', () => {
    it('should require the title field', () => {
      const ctrl = component.eventForm.get('title')!;
      ctrl.setValue('');
      ctrl.markAsTouched();
      expect(component.getError('title')).toBe('This field is required');
    });

    it('should enforce minimum title length of 3', () => {
      const ctrl = component.eventForm.get('title')!;
      ctrl.setValue('AB');
      ctrl.markAsTouched();
      expect(component.getError('title')).toContain('Minimum 3');
    });

    it('should enforce maximum title length of 50', () => {
      const ctrl = component.eventForm.get('title')!;
      ctrl.setValue('A'.repeat(51));
      ctrl.markAsTouched();
      expect(component.getError('title')).toContain('Maximum 50');
    });

    it('should reject an invalid email', () => {
      const ctrl = component.eventForm.get('email')!;
      ctrl.setValue('not-an-email');
      ctrl.markAsTouched();
      expect(component.getError('email')).toBe('Enter a valid email address');
    });

    it('should reject a past date', () => {
      const ctrl = component.eventForm.get('date')!;
      ctrl.setValue(new Date('2020-01-01'));
      ctrl.markAsTouched();
      expect(component.getError('date')).toBe('Date must be in the future');
    });

    it('should accept today as a valid date', () => {
      const ctrl = component.eventForm.get('date')!;
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      ctrl.setValue(today);
      ctrl.markAsTouched();
      expect(component.getError('date')).toBe('');
    });

    it('should reject capacity below 1', () => {
      const ctrl = component.eventForm.get('capacity')!;
      ctrl.setValue(0);
      ctrl.markAsTouched();
      expect(component.getError('capacity')).toBe('Value must be at least 1');
    });

    it('should reject capacity above 10000', () => {
      const ctrl = component.eventForm.get('capacity')!;
      ctrl.setValue(10001);
      ctrl.markAsTouched();
      expect(component.getError('capacity')).toBe('Value cannot exceed 10,000');
    });
  });

  describe('Form submission', () => {
    it('should call addEvent with form values on valid submit', () => {
      component.eventForm.setValue(validFormValue);
      component.onSubmit();
      expect(addEventMock).toHaveBeenCalledWith(validFormValue);
    });

    it('should navigate to /events after a successful submission', async () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      component.eventForm.setValue(validFormValue);
      component.onSubmit();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(['/events']);
    });

    it('should set isSubmitting to true during submission', () => {
      component.eventForm.setValue(validFormValue);
      component.onSubmit();
      expect(component.isSubmitting).toBe(true);
    });
  });
});
