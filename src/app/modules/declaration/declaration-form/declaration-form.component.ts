import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeclarationModel } from '../../../core/models/declaration.model';
import { DeclarationService } from '../../../core/services/declaration.service';
import { PlayerService } from '../../../core/services/player.service';
import { PlayerModel } from '../../../core/models/player.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service'; // ✅ Importar NotificationService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-declaration-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './declaration-form.component.html',
  styleUrl: './declaration-form.component.css'
})
export class DeclarationFormComponent implements OnInit {
  declaration: Partial<DeclarationModel> = {};
  players: Map<number, PlayerModel> = new Map();
  isEditMode = false;
  playersArray: PlayerModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private declarationService: DeclarationService,
    private playerService: PlayerService,
    private authService: AuthService,
    private notificationService: NotificationService, // ✅ Inyectar NotificationService
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPlayers();
    const declarationId = this.route.snapshot.paramMap.get('id');
    if (declarationId) {
      this.isEditMode = true;
      this.loadDeclaration(Number(declarationId));
    }
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        players.forEach(player => this.players.set(player.id, player));
        this.playersArray = Array.from(this.players.values());
      },
      error: (err) => console.error('Error al obtener jugadores:', err)
    });
  }

  loadDeclaration(id: number) {
    this.declarationService.getDeclarationById(id).subscribe({
      next: (data) => this.declaration = data,
      error: (err) => console.error('Error al obtener declaración:', err)
    });
  }

  saveDeclaration() {
    if (!this.declaration) {
      this.notificationService.showError("❌ Error: El objeto declaración no está definido.");
      return;
    }

    // 🔹 Obtener el usuario autenticado desde el AuthService
    const user = this.authService.getUser();
    if (!user?.id) {
      this.notificationService.showError("❌ Error: No se encontró el usuario autenticado.");
      return;
    }

    // 🔹 Asignar el `user_id` antes de enviar
    this.declaration.user_id = user.id;

    this.declarationService.createDeclaration(this.declaration).subscribe({
      next: (newDeclaration) => {
        this.notificationService.showSuccess("✅ Declaración creada exitosamente.");
        this.router.navigate(['/dashboard/declarations']);
      },
      error: (err) => {
        console.error("❌ Error al crear declaración:", err);

        // 🔹 Si el error tiene un array `errors`, mostramos los mensajes individuales
        if (err.error?.errors) {
          const errorMessages = err.error.errors.map((e: any) => `• ${e.msg}`).join('<br>');
          this.notificationService.showError(errorMessages, "Errores de validación");
        } else {
          this.notificationService.showError("Error al guardar la declaración.");
        }
      }
    });
  }


  navigateToDeclarationList() {
    this.notificationService.showInfo("Redirigiendo a la lista de declaraciones.");
    this.router.navigate(['/dashboard/declarations']);
  }
}
