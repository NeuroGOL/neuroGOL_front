import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisModel } from '../../../core/models/analysis.model';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { PlayerModel } from '../../../core/models/player.model';
import { AnalysisService } from '../../../core/services/analysis.service';
import { NlpAnalysisService } from '../../../core/services/nlp-analysis.service';
import { PlayerService } from '../../../core/services/player.service';
import { CommonModule } from '@angular/common';
import { NlpAnalysisModalComponent } from "../nlp-analysis-modal/nlp-analysis-modal.component";

@Component({
  selector: 'app-player-analysis',
  imports: [CommonModule, NlpAnalysisModalComponent],
  standalone: true,
  templateUrl: './player-analysis.component.html',
  styleUrl: './player-analysis.component.css'
})
export class PlayerAnalysisComponent implements OnInit {
  playerId!: number;
  player?: PlayerModel;
  analyses: AnalysisModel[] = [];
  nlpAnalyses: Map<number, NlpAnalysisModel> = new Map();
  isLoading = false;
  selectedNlpAnalysis?: NlpAnalysisModel;
  isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private analysisService: AnalysisService,
    private nlpAnalysisService: NlpAnalysisService
  ) { }

  ngOnInit() {
    this.playerId = Number(this.route.snapshot.paramMap.get('playerId'));

    if (!this.playerId) {
      console.error('Error: playerId no válido.');
      return;
    }

    this.loadPlayer();
    this.loadPlayerAnalyses();
    this.loadNlpAnalyses();
  }

  loadPlayer() {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        this.player = players.find(p => p.id === this.playerId);
      },
      error: (err) => console.error('Error al obtener jugador:', err)
    });
  }

  loadPlayerAnalyses() {
    this.analysisService.getAnalysis().subscribe({
      next: (data) => {
        this.analyses = data.filter(a => a.player_id === this.playerId);
        this.loadNlpAnalyses();
      },
      error: (err) => console.error('Error al obtener análisis:', err)
    });
  }

  loadNlpAnalyses() {
    this.nlpAnalysisService.getAllNlpAnalyses().subscribe({
      next: (nlpAnalyses) => {
        this.analyses.forEach(analysis => {
          const matchingNlp = nlpAnalyses.find(nlp => nlp.analysis_id === analysis.id);
          if (matchingNlp) {
            this.nlpAnalyses.set(analysis.id!, matchingNlp);
          }
        });
      },
      error: (err) => console.error('Error al obtener análisis NLP:', err)
    });
  }

  /** 🔹 Generar análisis con IA solo si no existe ya */
  analyzeWithIA(analysisId: number) {
    if (!analysisId || this.nlpAnalyses.has(analysisId)) {
      console.warn('⚠️ El análisis ya ha sido generado para este comentario.');
      return;
    }

    this.isLoading = true;
    console.log(`🔍 Generando análisis con IA para análisis ${analysisId}...`);

    this.nlpAnalysisService.generateNlpAnalysis(analysisId).subscribe({
      next: (nlpAnalysis) => {
        this.nlpAnalyses.set(analysisId, nlpAnalysis);
        this.isLoading = false;
        console.log('✅ Análisis generado con éxito:', nlpAnalysis);
      },
      error: (err) => {
        console.error('❌ Error al generar el análisis:', err);
        this.isLoading = false;
      }
    });
  }

  openModal(analysisId: number) {
    this.selectedNlpAnalysis = this.nlpAnalyses.get(analysisId);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
