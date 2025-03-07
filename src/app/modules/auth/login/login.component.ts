import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas';
        console.log(err.error);
        console.log(this.credentials);
        this.isLoading = false;
      }
    });
  }
}

