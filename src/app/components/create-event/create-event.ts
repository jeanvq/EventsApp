import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EventService } from '../../services/event';

// Validador personalizado: la fecha debe ser futura
function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value) >= today ? null : { pastDate: true };
}

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule
  ],
 templateUrl: './create-event.html',
styleUrls: ['./create-event.css']
})
export class CreateEventComponent implements OnInit {
  eventForm!: FormGroup;
  isSubmitting = false;
  minDate = new Date();

  categories = ['Technology', 'Music', 'Sports', 'Art', 'Food', 'Business', 'Other'];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', [Validators.required, futureDateValidator]],
      location: ['', Validators.required],
      category: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      organizer: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getError(field: string): string {
    const control = this.eventForm.get(field);
    if (!control || !control.errors || !control.touched) return '';

    const errors: { [key: string]: string } = {
      required: 'This field is required',
      minlength: `Minimum ${control.errors['minlength']?.requiredLength} characters`,
      maxlength: `Maximum ${control.errors['maxlength']?.requiredLength} characters`,
      min: 'Value must be at least 1',
      max: 'Value cannot exceed 10,000',
      email: 'Enter a valid email address',
      pastDate: 'Date must be in the future'
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError] || 'Invalid field';
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.eventService.addEvent(this.eventForm.value).subscribe({
      next: () => {
        this.snackBar.open('Event created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(`Error: ${err.message}`, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}

