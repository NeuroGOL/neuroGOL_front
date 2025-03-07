import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { PlayerModel } from '../../../core/models/player.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.css'
})
export class PlayersListComponent implements OnInit {
  players: PlayerModel[] = [];

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => this.players = players,
      error: (err) => console.error('Error al obtener jugadores:', err)
    });
  }

  editPlayer(id: number) {
    this.router.navigate(['/dashboard/players/edit', id]);
  }

  deletePlayer(id: number) {
    if (confirm('¿Estás seguro de eliminar este jugador?')) {
      this.playerService.deletePlayer(id).subscribe({
        next: () => this.loadPlayers(),
        error: (err) => console.error('Error al eliminar jugador:', err)
      });
    }
  }

  public navigateToNewPlayer() {
    this.router.navigate(['/dashboard/players/new']);
  }
}
