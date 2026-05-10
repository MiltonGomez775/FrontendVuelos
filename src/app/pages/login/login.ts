import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  onSubmit() {
    this.error.set('');
    this.loading.set(true);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.role === 'PASSENGER') this.router.navigate(['/dashboard']);
        else this.router.navigate(['/operator']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciales incorrectas. Verifica tu email y contraseña.');
      },
    });
  }
}
