import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  profile_picture = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.isLoading = true;

    const newUser = {
      nombre: this.nombre,
      email: this.email,
      contrasena: this.contrasena,
      role_id: 2, // Asignamos el rol de usuario por defecto
      profile_picture: this.profile_picture || 'assets/default-avatar.png'
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al registrarse. Intenta de nuevo.';
        console.error('❌ Error en registro:', err);
        this.isLoading = false;
      }
    });
  }
}
