import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-rsvp-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './rsvp-form.html',
styleUrls: ['./rsvp-form.css']
})
export class RsvpFormComponent {
  rsvp = {
    name: '',
    email: '',
    guests: 1,
    dietaryNeeds: '',
    status: ''
  };

  statusOptions = ['Attending', 'Not Attending', 'Maybe'];
  submitted = false;
  isSubmitting = false;

  constructor(private snackBar: MatSnackBar) {}

  onSubmit(form: any): void {
    if (form.invalid) return;

    this.isSubmitting = true;

    // Simula delay de envío
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitted = true;
      this.snackBar.open('RSVP submitted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
  }

  resetForm(form: any): void {
    form.reset();
    this.rsvp = {
      name: '',
      email: '',
      guests: 1,
      dietaryNeeds: '',
      status: ''
    };
    this.submitted = false;
  }
}