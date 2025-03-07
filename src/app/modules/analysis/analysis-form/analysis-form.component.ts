import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisModel } from '../../../core/models/analysis.model';
import { AnalysisService } from '../../../core/services/analysis.service';
import { PlayerService } from '../../../core/services/player.service';
import { PlayerModel } from '../../../core/models/player.model';
import { AuthService } from '../../../core/services/auth.service'; // ✅ Importar AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analysis-form.component.html',
  styleUrl: './analysis-form.component.css'
})
export class AnalysisFormComponent implements OnInit {
  analysis: Partial<AnalysisModel> = {};
  players: Map<number, PlayerModel> = new Map();
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private analysisService: AnalysisService,
    private playerService: PlayerService,
    private authService: AuthService, // ✅ Inyectar AuthService
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlayers();
    const analysisId = this.route.snapshot.paramMap.get('id');
    if (analysisId) {
      this.isEditMode = true;
      this.loadAnalysis(Number(analysisId));
    }
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        players.forEach(player => this.players.set(player.id, player));
      },
      error: (err) => console.error('Error al obtener jugadores:', err)
    });
  }

  loadAnalysis(id: number) {
    this.analysisService.getAnalysisById(id).subscribe({
      next: (data) => this.analysis = data,
      error: (err) => console.error('Error al obtener análisis:', err)
    });
  }

  saveAnalysis() {
    if (!this.analysis) {
      console.error("❌ Error: El objeto analysis no está definido.");
      return;
    }
  
    // 🔹 Obtener el usuario autenticado desde el AuthService
    const user = this.authService.getUser();
    if (!user?.id) {
      console.error("❌ Error: No se encontró el usuario autenticado.");
      return;
    }
  
    // 🔹 Asegurar que el user_id se asigna antes de enviar
    this.analysis.user_id = user.id;
  
    console.log("📤 Enviando análisis con user_id:", this.analysis);
  
    this.analysisService.createAnalysis(this.analysis).subscribe({
      next: (newAnalysis) => {
        console.log("✅ Análisis creado:", newAnalysis);
        this.router.navigate(['/dashboard/analysis']);
      },
      error: (err) => console.error("❌ Error al crear análisis:", err)
    });
  }  

  navigateToAnalysisList() {
    this.router.navigate(['/dashboard/analysis']);
  }
}
