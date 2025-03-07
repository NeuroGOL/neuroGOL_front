import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AnalysisModel } from '../../../core/models/analysis.model';
import { AnalysisService } from '../../../core/services/analysis.service';
import { PlayerService } from '../../../core/services/player.service';
import { UserService } from '../../../core/services/user.service';
import { PlayerModel } from '../../../core/models/player.model';
import { UserModel } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analysis-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './analysis-list.component.html',
  styleUrl: './analysis-list.component.css'
})
export class AnalysisListComponent implements OnInit {
  analyses: AnalysisModel[] = [];
  players: Map<number, PlayerModel> = new Map();
  users: Map<number, UserModel> = new Map();

  constructor(
    private analysisService: AnalysisService,
    private playerService: PlayerService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAnalyses();
    this.loadPlayers();
    this.loadUsers();
  }

  /** 🔹 Cargar lista de análisis */
  loadAnalyses() {
    this.analysisService.getAnalysis().subscribe({
      next: (data) => this.analyses = data,
      error: (err) => console.error('Error al obtener análisis:', err)
    });
  }

  /** 🔹 Cargar lista de jugadores */
  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        players.forEach(player => this.players.set(player.id, player));
      },
      error: (err) => console.error('Error al obtener jugadores:', err)
    });
  }

  /** 🔹 Cargar lista de usuarios */
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        users.forEach(user => this.users.set(user.id, user));
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }

  /** 🔹 Obtener nombre del jugador */
  getPlayerName(playerId: number): string {
    return this.players.get(playerId)?.nombre || 'Desconocido';
  }

  /** 🔹 Obtener equipo del jugador */
  getPlayerTeam(playerId: number): string {
    return this.players.get(playerId)?.equipo || 'Desconocido';
  }

  /** 🔹 Obtener imagen del jugador */
  getPlayerImage(playerId: number): string {
    return this.players.get(playerId)?.profile_picture || 'assets/default-avatar.png';
  }

  /** 🔹 Obtener nombre del usuario que creó el análisis */
  getUserName(userId: number): string {
    return this.users.get(userId)?.nombre || 'Desconocido';
  }

  /** 🔹 Navegar para agregar un nuevo análisis */
  navigateToNewAnalysis() {
    this.router.navigate(['/dashboard/analysis/new']);
  }

  /** 🔹 Editar análisis */
  editAnalysis(analysisId: number) {
    this.router.navigate([`/dashboard/analysis/edit/${analysisId}`]);
  }

  /** 🔹 Eliminar análisis */
  /** 🔹 Eliminar análisis con confirmación */
deleteAnalysis(analysisId: number) {
  const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este análisis?");
  
  if (!confirmDelete) return; // Si el usuario cancela, no hacer nada

  this.analysisService.deleteAnalysis(analysisId).subscribe({
    next: () => {
      this.analyses = this.analyses.filter(a => a.id !== analysisId);
      console.log("✅ Análisis eliminado correctamente.");
    },
    error: (err) => console.error('❌ Error al eliminar análisis:', err)
  });
}
}
