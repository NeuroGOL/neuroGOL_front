import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EQUIPOS_FPC } from '../../../core/constants/equipos';
import { PlayerModel } from '../../../core/models/player.model';
import { NotificationService } from '../../../core/services/notification.service'; // ✅ Importar NotificationService
import { PlayerService } from '../../../core/services/player.service';


@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css'
})
export class PlayerFormComponent implements OnInit {

  player: PlayerModel = { id: 0, nombre: '', equipo: '', nacionalidad: '', profile_picture: '' };
  isEditMode = false;
  isLoading = false; // ✅ Estado para deshabilitar el botón mientras guarda
  equipos = EQUIPOS_FPC

  constructor(
    private playerService: PlayerService,
    private notificationService: NotificationService, // ✅ Inyectar NotificationService
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode = true;
      this.playerService.getPlayerById(id).subscribe({
        next: (player) => this.player = player,
        error: (err) => {
          console.error('Error al obtener jugador:', err);
          this.notificationService.showError('Error al cargar los datos del jugador.');
        }
      });
    }
  }

  /** 🔹 Guardar o actualizar jugador */
  savePlayer() {
    this.isLoading = true; // 🔹 Deshabilitar botón mientras guarda

    const action = this.isEditMode
      ? this.playerService.updatePlayer(this.player.id!, this.player)
      : this.playerService.createPlayer(this.player);

    action.subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.showSuccess(
          this.isEditMode ? 'Jugador actualizado correctamente.' : 'Jugador creado correctamente.'
        );
        this.router.navigate(['/dashboard/players']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al guardar jugador:', err);
        this.handleError(err);
      }
    });
  }

  /** 🔹 Manejo de errores */
  handleError(err: any) {
    if (err.error?.errors) {
      const errorMessages = err.error.errors.map((e: any) => `<li>${e.msg}</li>`).join('');
      this.notificationService.showError(
        `<ul style="text-align: left; margin: 0;">${errorMessages}</ul>`,
        "Errores de validación"
      );
    } else {
      this.notificationService.showError("Error al guardar el jugador.");
    }
  }

  updatePreview() {
  }

  imageLoadError() {
    this.player.profile_picture = 'assets/default-avatar.png';
  }


  public navigateToPlayers() {
    this.router.navigate(['/dashboard/players']);
  }
}
