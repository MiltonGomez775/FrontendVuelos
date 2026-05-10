import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/flights', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'flights',
    loadComponent: () => import('./pages/flights/flights').then((m) => m.Flights),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/passenger-dashboard/passenger-dashboard').then((m) => m.PassengerDashboard),
    canActivate: [authGuard],
  },
  {
    path: 'operator',
    loadComponent: () =>
      import('./pages/operator-dashboard/operator-dashboard').then((m) => m.OperatorDashboard),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/flights' },
];
