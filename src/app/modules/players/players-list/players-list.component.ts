import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { PlayerModel } from '../../../core/models/player.model';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.css'
})
export class PlayersListComponent implements OnInit {
  players: PlayerModel[] = [];
  filteredPlayers: PlayerModel[] = [];
  filter: string = '';

  constructor(
    private playerService: PlayerService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        this.filteredPlayers = players;
      },
      error: (err) => console.error('Error al obtener jugadores:', err)
    });
  }

  applyFilter() {
    const value = this.filter.trim().toLowerCase();
    this.filteredPlayers = this.players.filter(player =>
      player.nombre.toLowerCase().includes(value) ||
      player.equipo.toLowerCase().includes(value)
    );
  }

  editPlayer(id: number) {
    this.router.navigate(['/dashboard/players/edit', id]);
  }

  deletePlayer(id: number) {
    this.notificationService.showConfirmation(
      'Eliminar Jugador',
      '¿Estás seguro de que deseas eliminar este jugador? Esta acción no se puede deshacer.'
    ).then((confirmed) => {
      if (confirmed) {
        this.playerService.deletePlayer(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Jugador eliminado correctamente.', 'Éxito');
            this.loadPlayers();
          },
          error: () => this.notificationService.showError('Error al eliminar jugador.', 'Error')
        });
      }
    });
  }

  navigateToNewPlayer() {
    this.router.navigate(['/dashboard/players/new']);
  }
}
