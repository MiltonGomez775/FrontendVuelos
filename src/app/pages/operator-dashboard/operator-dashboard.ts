import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { BaggageClaimService } from '../../services/baggage-claim.service';
import { AuthService } from '../../services/auth.service';
import { Flight, FlightRequest, FlightStatus } from '../../models/flight.model';
import { BaggageClaim, ClaimStatus } from '../../models/baggage-claim.model';

type Tab = 'flights' | 'claims';

@Component({
  selector: 'app-operator-dashboard',
  imports: [FormsModule],
  templateUrl: './operator-dashboard.html',
})
export class OperatorDashboard implements OnInit {
  private flightService = inject(FlightService);
  private baggageClaimService = inject(BaggageClaimService);
  protected auth = inject(AuthService);

  activeTab = signal<Tab>('flights');
  flights = signal<Flight[]>([]);
  claims = signal<BaggageClaim[]>([]);
  message = signal('');
  error = signal('');
  showFlightForm = signal(false);

  flightStatuses: FlightStatus[] = ['SCHEDULED', 'BOARDING', 'DELAYED', 'CANCELLED', 'DEPARTED', 'ARRIVED'];
  claimStatuses: ClaimStatus[] = ['OPEN', 'IN_REVIEW', 'RESOLVED'];

  flightForm: FlightRequest = this.emptyFlight();

  ngOnInit() {
    this.loadFlights();
    this.loadClaims();
  }

  emptyFlight(): FlightRequest {
    return {
      flightNumber: '', airline: '', origin: '', destination: '',
      departureTime: '', arrivalTime: '', gate: '', availableSeats: 100,
    };
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
    this.clearMessages();
  }

  clearMessages() {
    this.message.set('');
    this.error.set('');
  }

  loadFlights() {
    this.flightService.getAll().subscribe((d) => this.flights.set(d));
  }

  loadClaims() {
    this.baggageClaimService.getAll().subscribe((d) => this.claims.set(d));
  }

  createFlight() {
    this.clearMessages();
    this.flightService.create(this.flightForm).subscribe({
      next: () => {
        this.message.set('Vuelo creado exitosamente.');
        this.flightForm = this.emptyFlight();
        this.showFlightForm.set(false);
        this.loadFlights();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear el vuelo.');
      },
    });
  }

  updateFlightStatus(flight: Flight, event: Event) {
    const status = (event.target as HTMLSelectElement).value as FlightStatus;
    this.clearMessages();
    this.flightService.updateStatus(flight.id, status, flight.gate).subscribe({
      next: () => {
        this.message.set(`Estado de ${flight.flightNumber} actualizado a ${status}.`);
        this.loadFlights();
      },
      error: () => this.error.set('Error al actualizar el estado.'),
    });
  }

  deleteFlight(flight: Flight) {
    if (!confirm(`¿Eliminar vuelo ${flight.flightNumber}?`)) return;
    this.clearMessages();
    this.flightService.delete(flight.id).subscribe({
      next: () => {
        this.message.set('Vuelo eliminado.');
        this.loadFlights();
      },
      error: () => this.error.set('Error al eliminar el vuelo.'),
    });
  }

  updateClaimStatus(claim: BaggageClaim, event: Event) {
    const status = (event.target as HTMLSelectElement).value as ClaimStatus;
    this.clearMessages();
    this.baggageClaimService.updateStatus(claim.id, status).subscribe({
      next: () => {
        this.message.set('Estado del reclamo actualizado.');
        this.loadClaims();
      },
      error: () => this.error.set('Error al actualizar el reclamo.'),
    });
  }

  flightBadge(status: string): string {
    const map: Record<string, string> = {
      SCHEDULED: 'bg-info text-dark', BOARDING: 'bg-success', DELAYED: 'bg-warning text-dark',
      CANCELLED: 'bg-danger', DEPARTED: 'bg-secondary', ARRIVED: 'bg-primary',
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }

  claimBadge(status: string): string {
    const map: Record<string, string> = {
      OPEN: 'bg-danger', IN_REVIEW: 'bg-warning text-dark', RESOLVED: 'bg-success',
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  }
}
