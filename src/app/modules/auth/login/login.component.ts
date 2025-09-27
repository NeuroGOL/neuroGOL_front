import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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
  this.errorMessage = ''; // Limpiar errores anteriores

  this.authService.login(this.credentials).subscribe({
    next: () => {
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;

      // Capturar mensaje desde err.error.error
      this.errorMessage = err.error?.error || 'Ocurrió un error inesperado';
    }
  });
}


}

