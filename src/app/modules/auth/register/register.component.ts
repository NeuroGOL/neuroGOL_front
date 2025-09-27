import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombre = '';
  email = '';
  contrasena = '';
  confirmarContrasena = '';
  profile_picture = '';
  isLoading = false;
  errorMessage = ''; // NUEVO

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  register() {
    this.errorMessage = '';

    if (!this.nombre || !this.email || !this.contrasena) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;

    const newUser = {
      nombre: this.nombre,
      email: this.email,
      contrasena: this.contrasena,
      confirmar_contrasena: this.confirmarContrasena,
      role_id: 2,
      profile_picture: this.profile_picture || 'assets/default-avatar.png'
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        // 👇 Mostrar alerta de éxito
        this.notificationService.showSuccess(
          'Usuario registrado correctamente. Serás redirigido al login.',
          '¡Registro Exitoso!'
        );

        // Redirigir después de 3 segundos (coincide con el timer de la alerta)
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Error al registrarse. Intenta de nuevo.';
        }
      }
    });
  }
}