import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombre = '';
  email = '';
  contrasena = '';
  profile_picture = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  register() {
    if (!this.nombre || !this.email || !this.contrasena) {
      this.notificationService.showError('Todos los campos son obligatorios', 'Registro fallido');
      return;
    }

    this.isLoading = true;

    const newUser = {
      nombre: this.nombre,
      email: this.email,
      contrasena: this.contrasena,
      role_id: 2, // Rol por defecto (usuario normal)
      profile_picture: this.profile_picture || 'assets/default-avatar.png'
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registro exitoso', 'Bienvenido');
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Error en registro:', err);

        if (err.error?.errors) {
          err.error.errors.forEach((errorMsg: any) => {
            this.notificationService.showError(errorMsg.msg, 'Error en Registro');
          });
        } else {
          this.notificationService.showError('Error al registrarse. Intenta de nuevo.', 'Registro fallido');
        }
      }
    });
  }
}
