import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/notifications';

  getAll(): Observable<FlightNotification[]> {
    return this.http.get<FlightNotification[]>(this.API);
  }

  markRead(id: number): Observable<FlightNotification> {
    return this.http.patch<FlightNotification>(`${this.API}/${id}/read`, {});
  }

  countUnread(): Observable<number> {
    return this.http.get<number>(`${this.API}/unread-count`);
  }
}
