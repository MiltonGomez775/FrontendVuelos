import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaggageClaim, ClaimStatus } from '../models/baggage-claim.model';

@Injectable({ providedIn: 'root' })
export class BaggageClaimService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/baggage-claims';

  create(flightId: number, description: string): Observable<BaggageClaim> {
    return this.http.post<BaggageClaim>(this.API, { flightId, description });
  }

  getMy(): Observable<BaggageClaim[]> {
    return this.http.get<BaggageClaim[]>(`${this.API}/my`);
  }

  getAll(): Observable<BaggageClaim[]> {
    return this.http.get<BaggageClaim[]>(this.API);
  }

  updateStatus(id: number, status: ClaimStatus): Observable<BaggageClaim> {
    return this.http.patch<BaggageClaim>(`${this.API}/${id}/status`, { status });
  }
}
