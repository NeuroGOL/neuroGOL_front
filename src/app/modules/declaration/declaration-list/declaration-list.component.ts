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
import { AnalysisNplModalComponent } from '../../analysis/analysis-npl-modal/analysis-npl-modal.component';

@Component({
  selector: 'app-declaration-list',
  standalone: true,
  imports: [CommonModule, AnalysisNplModalComponent],
  templateUrl: './declaration-list.component.html',
  styleUrl: './declaration-list.component.css'
})
export class DeclarationListComponent implements OnInit {
  declarations: DeclarationModel[] = [];
  players: Map<number, PlayerModel> = new Map();
  users: Map<number, UserModel> = new Map();
  nlpAnalyses: Map<number, NlpAnalysisModel> = new Map();
  isLoading = false;
  selectedAnalysis?: NlpAnalysisModel;
  selectedDeclaration?: DeclarationModel;
  selectedPlayerId?: number;
  selectedDeclarationId?: number;
  isModalOpen = false;

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
    this.loadPlayers(); // 🔹 Restaurado
    this.loadUsers();   // 🔹 Restaurado
  }

  /** 🔹 Cargar todas las declaraciones */
  loadDeclarations() {
    this.declarationService.getDeclarations().subscribe({
      next: (data) => {
        this.declarations = data;
        this.loadNlpAnalyses();
      },
      error: (err) => {
        console.error('Error al obtener declaraciones:', err);
        this.notificationService.showError('Error al cargar declaraciones.');
      }
    });
  }

  /** 🔹 Cargar jugadores */
  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        players.forEach(player => this.players.set(player.id, player));
      },
      error: (err) => console.error('Error al obtener jugadores:', err)
    });
  }

  /** 🔹 Cargar usuarios */
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        users.forEach(user => this.users.set(user.id, user));
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }

  /** 🔹 Cargar análisis NLP asociados */
  loadNlpAnalyses() {
    this.nlpAnalysisService.getAllNlpAnalyses().subscribe({
      next: (nlpAnalyses) => {
        nlpAnalyses.forEach(nlp => this.nlpAnalyses.set(nlp.declaration_id, nlp));
      },
      error: (err) => {
        console.error('Error al obtener análisis NLP:', err);
        this.notificationService.showError('Error al cargar análisis NLP.');
      }
    });
  }

  /** 🔹 Analizar declaración con IA */
  analyzeDeclaration(declarationId: number) {
    console.log('🔍 Analizando declaración:', declarationId);
  
    const declaration = this.declarations.find(d => d.id === declarationId);
    if (!declaration) {
      this.notificationService.showError('No se encontró la declaración.');
      return;
    }
  
    this.selectedDeclarationId = declaration.id;
    this.selectedPlayerId = declaration.player_id;
  
    if (this.nlpAnalyses.has(declarationId)) {
      this.selectedAnalysis = this.nlpAnalyses.get(declarationId)!;
      this.isModalOpen = true;
      return;
    }
  
    this.isLoading = true;
    this.notificationService.showInfo('Generando análisis...', 'Por favor, espera');
  
    this.nlpAnalysisService.generateNlpAnalysis(declarationId).subscribe({
      next: (newAnalysis) => {
        this.nlpAnalyses.set(declarationId, newAnalysis);
        this.selectedAnalysis = newAnalysis;
        this.isModalOpen = true;
        this.isLoading = false;
        this.notificationService.showSuccess('Análisis generado con éxito.');
      },
      error: (err) => {
        console.error('Error al generar análisis:', err);
        this.isLoading = false;
        this.notificationService.showError('Error al generar el análisis.');
      }
    });
  }
  

  /** 🔹 Eliminar una declaración (solo si no tiene análisis asociado) */
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
  
  onReportGenerated(reportId: number) {
    console.log('📄 Reporte generado con ID:', reportId);
    this.notificationService.showSuccess('Reporte generado y almacenado con éxito.');
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

  /** 🔹 Obtener nombre del usuario que creó la declaración */
  getUserName(userId: number): string {
    return this.users.get(userId)?.nombre || 'Desconocido';
  }

  /** 🔹 Navegar para agregar una nueva declaración */
  navigateToNewDeclaration() {
    this.router.navigate(['/dashboard/declaration/new']);
  }

  navigateToEditDeclaration(declarationId: number) {
    this.router.navigate(['/dashboard/declaration/edit', declarationId]);
  }

  /** 🔹 Cerrar modal */
  closeModal() {
    this.isModalOpen = false;
  }
}
