import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportsService } from '../../../core/services/reports.service';
import { ReportModel } from '../../../core/models/report.model';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { PlayerService } from '../../../core/services/player.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reports-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-summary.component.html',
  styleUrls: ['./reports-summary.component.scss']
})
export class ReportsSummaryComponent implements OnChanges {

  @Input() playerId!: number;

  reports: Array<ReportModel & { analysis?: NlpAnalysisModel }> = [];
  filteredReports: Array<ReportModel & { analysis?: NlpAnalysisModel }> = [];

  emotionDistribution: { [emotion: string]: number } = {};
  rendimientoPromedio: number = 0;
  confusionData: any = null; // { matriz_confusion, etiquetas, reporte_clasificacion }

  emotionChart: any;
  confusionChart: any;
  playerName: any;

  constructor(private reportsService: ReportsService,
              private playerService: PlayerService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playerId'] && this.playerId != null) {
      this.loadReports();

      // Obtener el nombre del jugador (opcional, si tienes un servicio para eso)
      this.playerService.getPlayerById(this.playerId).subscribe(player => {
        this.playerName = player.nombre;
      });
    }
  }

  loadReports() {
    this.reportsService.getReports().subscribe(reports => {
      this.reports = reports;
      this.filteredReports = this.reports.filter(r => r.player_id === this.playerId);

      // Distribución de emociones
      this.emotionDistribution = this.getEmotionDistribution();

      // Rendimiento promedio
      this.rendimientoPromedio = this.getRendimientoPromedio();

      // Matriz de confusión y métricas
      const etiquetas = Array.from(new Set(this.filteredReports.map(r => r.analysis?.emocion_detectada || 'Sin dato')));
      const matriz_confusion: number[][] = etiquetas.map(() => etiquetas.map(() => 0));
      const reporte_clasificacion: any = {};

      // Llenar matriz y métricas
      this.filteredReports.forEach(r => {
        const real = r.analysis?.emocion_detectada || 'Sin dato';
        const pred = r.analysis?.emocion_predicha || real;
        const i = etiquetas.indexOf(real);
        const j = etiquetas.indexOf(pred);
        if (i >= 0 && j >= 0) matriz_confusion[i][j]++;
      });

      // Métricas simples
      etiquetas.forEach((label, idx) => {
        const tp = matriz_confusion[idx][idx];
        const fp = matriz_confusion.reduce((acc, row, i) => i !== idx ? acc + row[idx] : acc, 0);
        const fn = matriz_confusion[idx].reduce((acc, val, j) => j !== idx ? acc + val : acc, 0);
        const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
        const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
        const f1_score = precision + recall === 0 ? 0 : 2 * (precision * recall) / (precision + recall);
        const support = this.filteredReports.filter(r => (r.analysis?.emocion_detectada || 'Sin dato') === label).length;

        reporte_clasificacion[label] = { precision, recall, f1_score, support };
      });

      this.confusionData = { etiquetas, matriz_confusion, reporte_clasificacion };

      // Renderizar gráficos
      this.renderEmotionDistribution();
      this.renderConfusionMatrix();
    });
  }

  getEmotionDistribution(): { [emotion: string]: number } {
    const dist: { [emotion: string]: number } = {};
    this.filteredReports.forEach(r => {
      const emo = r.analysis?.emocion_detectada || 'Sin dato';
      dist[emo] = (dist[emo] || 0) + 1;
    });
    return dist;
  }

  getRendimientoPromedio(): number {
    if (!this.filteredReports.length) return 0;
    const total = this.filteredReports.reduce((acc, r) => {
      const val = r.analysis?.rendimiento_predicho;
      const num = typeof val === 'string' ? parseFloat(val) : (val ?? 0);
      return acc + (Number.isFinite(num) ? num : 0);
    }, 0);
    return total / this.filteredReports.length;
  }

  renderEmotionDistribution() {
    const ctx = (document.getElementById('emotionChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    if (this.emotionChart) this.emotionChart.destroy();

    this.emotionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.emotionDistribution),
        datasets: [{
          label: 'Cantidad de declaraciones',
          data: Object.values(this.emotionDistribution),
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Cantidad' } },
          x: { title: { display: true, text: 'Emoción' } }
        }
      }
    });
  }

  renderConfusionMatrix() {
    const ctx = (document.getElementById('confusionChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx || !this.confusionData) return;
    if (this.confusionChart) this.confusionChart.destroy();

    const { etiquetas, matriz_confusion } = this.confusionData;

    const datasets = etiquetas.map((label: any, i: number) => ({
      label,
      data: matriz_confusion[i],
      backgroundColor: `rgba(54, 162, 235, ${0.4 + (i / etiquetas.length) * 0.5})`
    }));

    this.confusionChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: etiquetas, datasets },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { stacked: true, title: { display: true, text: 'Predicción' } },
          y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Real' } }
        }
      }
    });
  }
}
