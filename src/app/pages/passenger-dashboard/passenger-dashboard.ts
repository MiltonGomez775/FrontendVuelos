import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ItineraryService } from '../../services/itinerary.service';
import { NotificationService } from '../../services/notification.service';
import { BaggageClaimService } from '../../services/baggage-claim.service';
import { FlightService } from '../../services/flight.service';
import { Itinerary } from '../../models/itinerary.model';
import { FlightNotification } from '../../models/notification.model';
import { BaggageClaim } from '../../models/baggage-claim.model';
import { Flight } from '../../models/flight.model';

type Tab = 'itineraries' | 'notifications' | 'claims';

@Component({
  selector: 'app-passenger-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './passenger-dashboard.html',
})
export class PassengerDashboard implements OnInit {
  protected auth = inject(AuthService);
  private itineraryService = inject(ItineraryService);
  private notificationService = inject(NotificationService);
  private baggageClaimService = inject(BaggageClaimService);
  private flightService = inject(FlightService);

  activeTab = signal<Tab>('itineraries');
  itineraries = signal<Itinerary[]>([]);
  notifications = signal<FlightNotification[]>([]);
  claims = signal<BaggageClaim[]>([]);
  flights = signal<Flight[]>([]);

  claimFlightId = '';
  claimDescription = '';
  claimMessage = signal('');
  claimError = signal('');
  submittingClaim = signal(false);

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.itineraryService.getMy().subscribe((d) => this.itineraries.set(d));
    this.notificationService.getAll().subscribe((d) => this.notifications.set(d));
    this.baggageClaimService.getMy().subscribe((d) => this.claims.set(d));
    this.flightService.getAll().subscribe((d) => this.flights.set(d));
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  markRead(id: number) {
    this.notificationService.markRead(id).subscribe(() => {
      this.notifications.update((list) =>
        list.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    });
  }

  unreadCount(): number {
    return this.notifications().filter((n) => !n.read).length;
  }

  submitClaim() {
    this.claimMessage.set('');
    this.claimError.set('');
    if (!this.claimFlightId || !this.claimDescription.trim()) {
      this.claimError.set('Selecciona un vuelo y escribe la descripción.');
      return;
    }
    this.submittingClaim.set(true);
    this.baggageClaimService.create(Number(this.claimFlightId), this.claimDescription).subscribe({
      next: () => {
        this.submittingClaim.set(false);
        this.claimMessage.set('Reclamo creado exitosamente.');
        this.claimFlightId = '';
        this.claimDescription = '';
        this.baggageClaimService.getMy().subscribe((d) => this.claims.set(d));
      },
      error: (err) => {
        this.submittingClaim.set(false);
        this.claimError.set(err.error?.message || 'Error al crear el reclamo.');
      },
    });
  }

  claimBadge(status: string): string {
    const map: Record<string, string> = {
      OPEN: 'bg-danger', IN_REVIEW: 'bg-warning text-dark', RESOLVED: 'bg-success',
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }

  flightBadge(status: string): string {
    const map: Record<string, string> = {
      SCHEDULED: 'bg-info text-dark', BOARDING: 'bg-success', DELAYED: 'bg-warning text-dark',
      CANCELLED: 'bg-danger', DEPARTED: 'bg-secondary', ARRIVED: 'bg-primary',
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  }
}
