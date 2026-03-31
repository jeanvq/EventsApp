import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventService } from '../../services/event';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.html',
styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.hasError = false;

    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;
        this.snackBar.open(`Failed to load events: ${err.message}`, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
