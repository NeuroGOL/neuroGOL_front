import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeclarationModel } from '../../../core/models/declaration.model';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { PlayerModel } from '../../../core/models/player.model';
import { UserModel } from '../../../core/models/user.model';
import { DeclarationService } from '../../../core/services/declaration.service';
import { NlpAnalysisService } from '../../../core/services/nlp-analysis.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PlayerService } from '../../../core/services/player.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-declaration-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './declaration-list.component.html',
  styleUrl: './declaration-list.component.css'
})
export class DeclarationListComponent implements OnInit {
  declarations: DeclarationModel[] = [];
  players: Map<number, PlayerModel> = new Map();
  users: Map<number, UserModel> = new Map();
  nlpAnalyses: Map<number, NlpAnalysisModel> = new Map();
  isLoading = false;

  constructor(
    private declarationService: DeclarationService,
    private playerService: PlayerService,
    private userService: UserService,
    private nlpAnalysisService: NlpAnalysisService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadDeclarations();
    this.loadPlayers();
    this.loadUsers();
  }

  loadDeclarations() {
    this.declarationService.getDeclarations().subscribe({
      next: (data) => {
        this.declarations = data;
        this.loadNlpAnalyses();
      },
      error: () => this.notificationService.showError('Error al cargar declaraciones.')
    });
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => players.forEach(p => this.players.set(p.id, p)),
      error: () => console.error('Error al obtener jugadores')
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => users.forEach(u => this.users.set(u.id, u)),
      error: () => console.error('Error al obtener usuarios')
    });
  }

  loadNlpAnalyses() {
    this.nlpAnalysisService.getAllNlpAnalyses().subscribe({
      next: (analyses) => analyses.forEach(a => this.nlpAnalyses.set(a.declaration_id, a)),
      error: () => this.notificationService.showError('Error al cargar análisis NLP.')
    });
  }

  generateAnalysis(declarationId: number) {
    if (this.nlpAnalyses.has(declarationId)) return;

    this.notificationService.showInfo('Generando análisis...', 'Por favor, espera');

    this.nlpAnalysisService.generateNlpAnalysis(declarationId).subscribe({
      next: (analysis) => {
        this.nlpAnalyses.set(declarationId, analysis);
        this.notificationService.showSuccess('Análisis generado con éxito.');
      },
      error: () => this.notificationService.showError('Error al generar análisis.')
    });
  }

  goToAnalysis(declarationId: number) {
    this.router.navigate(['/dashboard/analisis', declarationId]);
  }

  getPlayerName(id: number): string {
    return this.players.get(id)?.nombre || 'Desconocido';
  }

  getPlayerTeam(id: number): string {
    return this.players.get(id)?.equipo || 'Desconocido';
  }

  getPlayerImage(id: number): string {
    return this.players.get(id)?.profile_picture || 'assets/sinfoto.png';
  }

  getUserName(id: number): string {
    return this.users.get(id)?.nombre || 'Desconocido';
  }

  navigateToNewDeclaration() {
    this.router.navigate(['/dashboard/declaration/new']);
  }

  navigateToEditDeclaration(id: number) {
    this.router.navigate(['/dashboard/declaration/edit', id]);
  }

  deleteDeclaration(declarationId: number) {
  if (this.nlpAnalyses.has(declarationId)) {
    this.notificationService.showWarning('No puedes eliminar esta declaración porque ya tiene un análisis asociado.');
    return;
  }

  this.notificationService.showConfirmation(
    'Eliminar declaración',
    '¿Estás seguro de que deseas eliminar esta declaración?',
  ).then((confirmed) => {
    if (confirmed) {
      this.declarationService.deleteDeclaration(declarationId).subscribe({
        next: () => {
          this.declarations = this.declarations.filter(d => d.id !== declarationId);
          this.notificationService.showSuccess('Declaración eliminada correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar declaración:', err);
          this.notificationService.showError('Error al eliminar declaración', err);
        }
      });
    }
  });
}
} 
