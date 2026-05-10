import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: 'PASSENGER' | 'OPERATOR' = 'PASSENGER';
  error = signal('');
  loading = signal(false);

  onSubmit() {
    this.error.set('');
    this.loading.set(true);
    this.auth
      .register({ name: this.name, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.role === 'PASSENGER') this.router.navigate(['/dashboard']);
          else this.router.navigate(['/operator']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Error al registrarse. El email puede estar en uso.');
        },
      });
  }
}
