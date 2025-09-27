import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.97)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.97)' }))
      ])
    ])
  ]
})
export class EditarPerfilComponent {
  user!: UserModel;
  updatedUser: UserModel = {} as UserModel;

  alertMessage: string = '';
  alertType: 'success' | 'danger' | '' = '';
  editMode: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.updatedUser = { ...this.user };
    if (!this.updatedUser.profile_picture) {
      this.updatedUser.profile_picture = '';
    }
  }

  saveProfile(): void {
    this.userService.updateUser(this.updatedUser).subscribe({
      next: () => {
        this.alertType = 'success';
        this.alertMessage = 'Perfil actualizado correctamente.';
        this.user = { ...this.updatedUser };
        this.authService.setUser(this.user); // ✅ Actualiza en localStorage
        this.editMode = false;
      },
      error: (err) => {
        this.alertType = 'danger';
        this.alertMessage = err.error?.error || 'Error al actualizar el perfil.';
      }
    });
  }

  cancelEdit(): void {
    this.updatedUser = { ...this.user };
    this.editMode = false;
    this.closeAlert();
  }

  closeAlert(): void {
    this.alertMessage = '';
    this.alertType = '';
  }
}
