import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.production';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  /** 🔹 Iniciar sesión y almacenar el token */
  login(credentials: { email: string; contrasena: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<{ token: string, user: any }>(`${this.apiUrl}/login`, credentials).subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authState.next(true);
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }


  /** 🔹 Registrar un nuevo usuario */
  register(user: { nombre: string; email: string; contrasena: string; role_id?: number; profile_picture?: string }): Observable<any> {
    const userData = {
      ...user,
      role_id: user.role_id ?? 2, // Si no se proporciona, asignar el rol por defecto (usuario normal)
      profile_picture: user.profile_picture || 'assets/default-avatar.png' // Asignar una imagen por defecto si no se proporciona
    };

    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/register`, userData).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** 🔹 Cerrar sesión */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  /** 🔹 Verifica si hay un token almacenado */
  hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /** 🔹 Obtener el usuario autenticado */
  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  setUser(user: UserModel): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /** 🔹 Saber si el usuario está autenticado */
  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
