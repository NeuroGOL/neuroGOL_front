import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { PlayerModel } from '../../../core/models/player.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css'
})
export class PlayerFormComponent implements OnInit {
  player: PlayerModel = { id: 0, nombre: '', equipo: '', nacionalidad: '', fecha_nacimiento: '', profile_picture: '' };
  isEditMode = false;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode = true;
      this.playerService.getPlayerById(id).subscribe({
        next: (player) => this.player = player,
        error: (err) => console.error('Error al obtener jugador:', err)
      });
    }
  }

  savePlayer() {
    if (this.isEditMode) {
      this.playerService.updatePlayer(this.player.id!, this.player).subscribe({
        next: () => this.router.navigate(['/dashboard/players']),
        error: (err) => console.error('Error al actualizar jugador:', err)
      });
    } else {
      this.playerService.createPlayer(this.player).subscribe({
        next: () => this.router.navigate(['/dashboard/players']),
        error: (err) => console.error('Error al crear jugador:', err)
      });
    }
  }

  public navigateToPlayers() {
    this.router.navigate(['/dashboard/players']);
  }
}
