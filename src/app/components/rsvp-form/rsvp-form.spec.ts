import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { vi } from 'vitest';

import { RsvpFormComponent } from './rsvp-form';

describe('RsvpFormComponent', () => {
  let component: RsvpFormComponent;
  let fixture: ComponentFixture<RsvpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsvpFormComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(RsvpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize rsvp with default values', () => {
    expect(component.rsvp.name).toBe('');
    expect(component.rsvp.email).toBe('');
    expect(component.rsvp.guests).toBe(1);
    expect(component.rsvp.dietaryNeeds).toBe('');
    expect(component.rsvp.status).toBe('');
  });

  it('should start with submitted set to false', () => {
    expect(component.submitted).toBe(false);
  });

  it('should have the three attendance status options', () => {
    expect(component.statusOptions).toEqual(['Attending', 'Not Attending', 'Maybe']);
  });

  it('should not submit when the template-driven form is invalid', () => {
    const mockForm = { invalid: true } as any;
    component.onSubmit(mockForm);
    expect(component.submitted).toBe(false);
    expect(component.isSubmitting).toBe(false);
  });

  it('should set isSubmitting to true when form is valid and submitted', () => {
    const mockForm = { invalid: false } as any;
    component.onSubmit(mockForm);
    expect(component.isSubmitting).toBe(true);
  });

  it('should mark as submitted after 1-second delay (using fake timers)', () => {
    vi.useFakeTimers();
    const mockForm = { invalid: false } as any;
    component.onSubmit(mockForm);
    expect(component.isSubmitting).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(component.submitted).toBe(true);
    expect(component.isSubmitting).toBe(false);
    vi.useRealTimers();
  });

  it('should reset to initial state when resetForm() is called', () => {
    const mockForm = { reset: vi.fn() } as any;
    component.submitted = true;
    component.rsvp.name = 'Alice';
    component.rsvp.email = 'alice@example.com';
    component.rsvp.guests = 4;

    component.resetForm(mockForm);

    expect(mockForm.reset).toHaveBeenCalled();
    expect(component.submitted).toBe(false);
    expect(component.rsvp.name).toBe('');
    expect(component.rsvp.guests).toBe(1);
  });
});
