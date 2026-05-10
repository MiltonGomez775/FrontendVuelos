import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API = 'http://localhost:8080/api/auth';

  currentUser = signal<AuthResponse | null>(this.loadUser());

  private loadUser(): AuthResponse | null {
    const stored = localStorage.getItem('flytrack_user');
    return stored ? JSON.parse(stored) : null;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, request).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, request).pipe(
      tap(res => this.saveSession(res))
    );
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('flytrack_token', res.token);
    localStorage.setItem('flytrack_user', JSON.stringify(res));
    this.currentUser.set(res);
  }

  logout(): void {
    localStorage.removeItem('flytrack_token');
    localStorage.removeItem('flytrack_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('flytrack_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.currentUser()?.role ?? null;
  }
}
