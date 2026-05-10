import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Itinerary } from '../models/itinerary.model';

@Injectable({ providedIn: 'root' })
export class ItineraryService {
  private http = inject(HttpClient);
  private readonly API = '/api/itineraries';

  book(flightId: number, seatNumber: string): Observable<Itinerary> {
    return this.http.post<Itinerary>(this.API, { flightId, seatNumber });
  }

  getMy(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.API}/my`);
  }
}
