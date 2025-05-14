import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { email: '', contrasena: '' }; // ⚠️ Cambiar "password" por "contrasena"
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  login() {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.notificationService.showSuccess('Inicio de sesión exitoso', 'Bienvenido');
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Error en login:', err);

        if (err.error?.errors) {
          err.error.errors.forEach((errorMsg: any) => {
            this.notificationService.showError(errorMsg.msg, 'Error en Login');
          });
        } else {
          this.notificationService.showError('Credenciales incorrectas', 'Error');
        }
      }
    });
  }

}

