import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { ItineraryService } from '../../services/itinerary.service';
import { AuthService } from '../../services/auth.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flights',
  imports: [FormsModule],
  templateUrl: './flights.html',
})
export class Flights implements OnInit {
  private flightService = inject(FlightService);
  private itineraryService = inject(ItineraryService);
  protected auth = inject(AuthService);

  flights = signal<Flight[]>([]);
  selectedFlight = signal<Flight | null>(null);
  seatNumber = '';
  bookingMessage = signal('');
  bookingError = signal('');
  loading = signal(false);
  showBookPanel = signal(false);

  ngOnInit() {
    this.flightService.getAll().subscribe((data) => this.flights.set(data));
  }

  selectFlight(f: Flight) {
    this.selectedFlight.set(f);
    this.seatNumber = '';
    this.bookingMessage.set('');
    this.bookingError.set('');
    this.showBookPanel.set(true);
  }

  closePanel() {
    this.showBookPanel.set(false);
    this.selectedFlight.set(null);
  }

  book() {
    const f = this.selectedFlight();
    if (!f || !this.seatNumber.trim()) return;
    this.loading.set(true);
    this.itineraryService.book(f.id, this.seatNumber).subscribe({
      next: (it) => {
        this.loading.set(false);
        this.bookingMessage.set(`Reserva exitosa! Código: ${it.bookingCode}`);
        this.seatNumber = '';
      },
      error: (err) => {
        this.loading.set(false);
        this.bookingError.set(err.error?.message || 'Error al reservar. Puede que ya tengas una reserva en este vuelo.');
      },
    });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      SCHEDULED: 'bg-info text-dark',
      BOARDING: 'bg-success',
      DELAYED: 'bg-warning text-dark',
      CANCELLED: 'bg-danger',
      DEPARTED: 'bg-secondary',
      ARRIVED: 'bg-primary',
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  }

  canBook(f: Flight): boolean {
    return f.status !== 'CANCELLED' && f.status !== 'DEPARTED' && f.status !== 'ARRIVED';
  }
}
