import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight, FlightRequest } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/flights';

  getAll(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.API);
  }

  getById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.API}/${id}`);
  }

  create(req: FlightRequest): Observable<Flight> {
    return this.http.post<Flight>(this.API, req);
  }

  updateStatus(id: number, status: string, gate?: string): Observable<Flight> {
    return this.http.patch<Flight>(`${this.API}/${id}/status`, { status, gate });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
