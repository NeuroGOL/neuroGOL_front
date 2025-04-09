import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { ReportsService } from '../../../core/services/reports.service';
import { NlpAnalysisService } from '../../../core/services/nlp-analysis.service';
import { DeclarationService } from '../../../core/services/declaration.service';
import { UserService } from '../../../core/services/user.service';
import { ReportModel } from '../../../core/models/report.model';
import { PlayerModel } from '../../../core/models/player.model';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { DeclarationModel } from '../../../core/models/declaration.model';
import { UserModel } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-reports-by-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-by-player.component.html',
  styleUrl: './reports-by-player.component.css'
})
export class ReportsByPlayerComponent implements OnInit {
  fullReports: Array<{
    report: ReportModel;
    player: PlayerModel;
    analysis: NlpAnalysisModel;
    declaration: DeclarationModel;
    user: UserModel;
  }> = [];

  playerId!: number;

  constructor(
    private route: ActivatedRoute,
    private reportsService: ReportsService,
    private playerService: PlayerService,
    private declarationService: DeclarationService,
    private nlpService: NlpAnalysisService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.playerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReports();
  }

  async loadReports() {
    const [reports, players, declarations, analyses, users] = await Promise.all([
      this.reportsService.getReports().toPromise(),
      this.playerService.getPlayers().toPromise(),
      this.declarationService.getDeclarations().toPromise(),
      this.nlpService.getAllNlpAnalyses().toPromise(),
      this.userService.getUsers().toPromise()
    ]);

    const playerMap = new Map((players ?? []).map(p => [p.id, p]));
    const declMap = new Map((declarations ?? []).map(d => [d.id!, d]));
    const analysisMap = new Map((analyses ?? []).map(a => [a.id!, a]));
    const userMap = new Map((users ?? []).map(u => [u.id, u]));

    this.fullReports = (reports ?? [])
      .filter(r => r.player_id === this.playerId) // ✅ Solo los del jugador actual
      .map(report => ({
        report,
        player: playerMap.get(report.player_id)!,
        declaration: declMap.get(report.declaration_id)!,
        analysis: analysisMap.get(report.nlp_analysis_id)!,
        user: userMap.get(report.generado_por)!
      }));
  }

  exportReportAsPDF(reportData: any) {
    const element = document.createElement('div');
    const logoUrl = 'assets/neurogol.png';

    element.innerHTML = `
      <div style="
        position: relative;
        font-family: Arial, sans-serif;
        padding: 60px 40px;
        max-width: 800px;
        color: #1c1c1c;
      ">
        <img src="${logoUrl}" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60%;
          transform: translate(-50%, -50%);
          opacity: 0.15;
          z-index: 0;
        " />

        <div style="position: relative; z-index: 1;">
          <h2 style="color: #1DB954; border-bottom: 2px solid #1DB954; padding-bottom: 8px;">
            Reporte de Evaluación Emocional
          </h2>

          <h3 style="margin-top: 30px;">🧍 Jugador</h3>
          <p><strong>Nombre:</strong> ${reportData.player.nombre}</p>
          <p><strong>Equipo:</strong> ${reportData.player.equipo}</p>
          <p><strong>Nacionalidad:</strong> ${reportData.player.nacionalidad}</p>

          <h3 style="margin-top: 30px;">📄 Declaración</h3>
          <p><strong>Texto:</strong> “${reportData.declaration.texto}”</p>
          <p><strong>Categoría:</strong> ${reportData.declaration.categoria_texto}</p>
          <p><strong>Fuente:</strong> ${reportData.declaration.fuente}</p>
          <p><strong>Fecha:</strong> ${new Date(reportData.declaration.created_at).toLocaleString()}</p>

          <h3 style="margin-top: 30px;">🧠 Análisis de IA</h3>
          <p><strong>Emoción Detectada:</strong> ${reportData.analysis.emocion_detectada}</p>
          <p><strong>Tendencia Emocional:</strong> ${reportData.analysis.tendencia_emocional}</p>
          <p><strong>Impacto en Rendimiento:</strong> ${reportData.analysis.impacto_en_rendimiento}</p>
          <p><strong>Impacto en Equipo:</strong> ${reportData.analysis.impacto_en_equipo}</p>
          <p><strong>Estado Actual:</strong> ${reportData.analysis.estado_actual_emocional}</p>
          <p><strong>Rendimiento Predicho:</strong> ${reportData.analysis.rendimiento_predicho}</p>
          <p><strong>Resumen:</strong> ${reportData.analysis.resumen_general}</p>
          <p><strong>Acciones Recomendadas:</strong> ${reportData.analysis.acciones_recomendadas}</p>

          <h3 style="margin-top: 30px;">👤 Generado por</h3>
          <p><strong>Nombre:</strong> ${reportData.user.nombre}</p>
          <p><strong>Email:</strong> ${reportData.user.email}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `Reporte_${reportData.player.nombre.replace(/ /g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }
}
