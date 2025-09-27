import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { DeclarationModel } from '../../../core/models/declaration.model';
import { PlayerModel } from '../../../core/models/player.model';
import { NlpAnalysisService } from '../../../core/services/nlp-analysis.service';
import { DeclarationService } from '../../../core/services/declaration.service';
import { PlayerService } from '../../../core/services/player.service';
import { ReportsService } from '../../../core/services/reports.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-analysis-npl-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-npl-modal.component.html',
  styleUrl: './analysis-npl-modal.component.css'
})
export class AnalysisNplModalComponent {
  analysis?: NlpAnalysisModel;
  declaration?: DeclarationModel;
  player?: PlayerModel;
  declarationId!: number;
  playerId!: number;
  isLoading = false;
  hasReport = false;

  constructor(
    private route: ActivatedRoute,
    private nlpService: NlpAnalysisService,
    private declarationService: DeclarationService,
    private playerService: PlayerService,
    private reportsService: ReportsService,
    private notificationService: NotificationService,
    public router: Router
  ) { }

  ngOnInit(): void {
    const declarationId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📌 Declaración ID desde ruta:', declarationId);

    if (!declarationId || isNaN(declarationId)) {
      this.router.navigate(['/dashboard/declarations']);
      return;
    }

    this.declarationId = declarationId;
    this.loadAnalysis();
  }

  loadAnalysis(): void {
    this.isLoading = true;

    this.nlpService.getAnalysisByDeclaration(this.declarationId).subscribe({
      next: (analysis) => {
        if (!analysis) {
          this.notificationService.showError('No se encontró el análisis');
          this.router.navigate(['/dashboard/declarations']);
          return;
        }

        this.analysis = analysis;

        this.declarationService.getDeclarationById(this.declarationId).subscribe({
          next: (declaration) => {
            this.declaration = declaration;
            this.playerId = declaration.player_id;

            this.playerService.getPlayerById(declaration.player_id).subscribe({
              next: (player) => {
                this.player = player;
                this.isLoading = false;
              },
              error: () => {
                this.notificationService.showError('No se pudo cargar la información del jugador');
                this.isLoading = false;
              }
            });
          },
          error: () => {
            this.notificationService.showError('No se pudo cargar la declaración');
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.notificationService.showError('No se pudo cargar el análisis');
        this.router.navigate(['/dashboard/declarations']);
      }
    });
  }

  generateReport(): void {
    if (!this.analysis || this.analysis.id === undefined) return;

    const user = localStorage.getItem('user');
    if (!user) return;

    const userId = JSON.parse(user).id;

    console.log('🧩 Verificando datos antes de generar reporte:', {
      declarationId: this.declarationId,
      playerId: this.playerId
    });

    if (this.declarationId === undefined || this.playerId === undefined) {
      this.notificationService.showError('Faltan datos para generar el reporte.');
      return;
    }

    this.isLoading = true;

    this.reportsService.createReport(
      this.declarationId,
      this.analysis.id,
      userId,
      this.playerId
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Reporte generado');
        this.hasReport = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al generar el reporte:', error); // <-- Aquí
        this.notificationService.showError('No se pudo generar el reporte');
        this.isLoading = false;
      }
    });
  }

  // Mapa de traducción
  private emotionMap: Record<string, string> = {
    anger: 'Ira',
    disgust: 'Asco',
    fear: 'Miedo',
    joy: 'Alegría',
    neutral: 'Neutral',
    sadness: 'Tristeza',
    surprise: 'Sorpresa'
  };

  translateEmotion(emotion?: string): string {
    if (!emotion) return '';
    return this.emotionMap[emotion.toLowerCase()] || emotion;
  }
}
