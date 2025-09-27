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
    expanded: boolean;
  }> = [];

  playerId!: number;

  constructor(
    private route: ActivatedRoute,
    private reportsService: ReportsService,
    private playerService: PlayerService,
    private declarationService: DeclarationService,
    private nlpService: NlpAnalysisService,
    private userService: UserService
  ) { }

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
      .filter(r => r.player_id === this.playerId)
      .map(report => ({
        report,
        player: playerMap.get(report.player_id)!,
        declaration: declMap.get(report.declaration_id)!,
        analysis: analysisMap.get(report.nlp_analysis_id)!,
        user: userMap.get(report.generado_por)!,
        expanded: false // 👈
      }));

  }

  exportReportAsPDF(reportData: any) {
    const element = document.createElement('div');
    const logoUrl = 'assets/neurogol.png';

    element.innerHTML = `
    <div style="
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 40px;
      max-width: 800px;
      color: #1c1c1c;
    ">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" style="height: 60px; margin-bottom: 10px;" />
        <h2 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
          Expediente de Evaluación Emocional
        </h2>
        <hr style="margin-top: 10px; border: 1px solid #1DB954;" />
      </div>

      <!-- DATOS DEL JUGADOR -->
      <h3 style="background: #f0f0f0; padding: 6px; border: 1px solid #ccc; margin-top: 20px;">DATOS DEL JUGADOR</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px; width: 50%;"><strong>Nombre:</strong> ${reportData.player.nombre}</td>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Equipo:</strong> ${reportData.player.equipo}</td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;"><strong>Nacionalidad:</strong> ${reportData.player.nacionalidad}</td>
        </tr>
      </table>

      <!-- DECLARACIÓN -->
      <h3 style="background: #f0f0f0; padding: 6px; border: 1px solid #ccc; margin-top: 20px;">DECLARACIÓN ANALIZADA</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;"><strong>Texto:</strong> “${reportData.declaration.texto}”</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Categoría:</strong> ${reportData.declaration.categoria_texto}</td>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Fuente:</strong> ${reportData.declaration.fuente}</td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;"><strong>Fecha:</strong> ${new Date(reportData.declaration.created_at).toLocaleString()}</td>
        </tr>
      </table>

      <!-- ANÁLISIS DE IA -->
      <h3 style="background: #f0f0f0; padding: 6px; border: 1px solid #ccc; margin-top: 20px;">ANÁLISIS DE INTELIGENCIA ARTIFICIAL</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Emoción Detectada:</strong> ${reportData.analysis.emocion_detectada}</td>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Tendencia Emocional:</strong> ${reportData.analysis.tendencia_emocional}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Impacto en Rendimiento:</strong> ${reportData.analysis.impacto_en_rendimiento}</td>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Impacto en Equipo:</strong> ${reportData.analysis.impacto_en_equipo}</td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;"><strong>Rendimiento Predicho:</strong> ${reportData.analysis.rendimiento_predicho}</td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;"><strong>Resumen General:</strong> ${reportData.analysis.resumen_general}</td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;"><strong>Acciones Recomendadas:</strong> ${reportData.analysis.acciones_recomendadas}</td>
        </tr>
      </table>

      <!-- GENERADO POR -->
      <h3 style="background: #f0f0f0; padding: 6px; border: 1px solid #ccc; margin-top: 20px;">GENERADO POR</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Nombre:</strong> ${reportData.user.nombre}</td>
          <td style="border: 1px solid #ccc; padding: 6px;"><strong>Email:</strong> ${reportData.user.email}</td>
        </tr>
      </table>
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
