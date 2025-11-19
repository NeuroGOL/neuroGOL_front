import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
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

      // Renderizar gráficos
      this.renderEmotionDistribution();
      setTimeout(() => this.renderEmotionTimeline(), 0); // Asegura que el canvas esté listo
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

    const emociones = Object.keys(this.emotionDistribution);
    const labelsTraducidas = emociones.map(e => this.getEmotionLabel(e));
    const colores = emociones.map(e => this.getEmotionColor(e));

    this.emotionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labelsTraducidas,
        datasets: [{
          label: 'Cantidad de emociones detectadas',
          data: Object.values(this.emotionDistribution),
          backgroundColor: colores
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Cantidad' }
          },
          x: {
            title: { display: true, text: 'Emoción detectada' }
          }
        }
      }
    });
  }

  getEmotionTimelineData() {
    return this.filteredReports
      .filter(r => r.analysis?.emocion_detectada && r.created_at != null)
      .map(r => ({
        fecha: new Date(r.created_at!), // Asegúrate que el campo se llama así y existe
        emocion: r.analysis!.emocion_detectada
      }));
  }

  getEmotionColor(emocion: string): string {
    const colorMap: { [key: string]: string } = {
      anger: 'rgba(255, 99, 132, 0.7)',
      disgust: 'rgba(75, 192, 192, 0.7)',
      fear: 'rgba(153, 102, 255, 0.7)',
      joy: 'rgba(255, 206, 86, 0.7)',
      neutral: 'rgba(201, 203, 207, 0.7)',
      sadness: 'rgba(54, 162, 235, 0.7)',
      surprise: 'rgba(255, 159, 64, 0.7)',
    };
    return colorMap[emocion] || 'rgba(100, 100, 100, 0.7)'; // color por defecto
  }


  renderEmotionTimeline() {
    const ctx = (document.getElementById('emotionTimelineChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const data = this.getEmotionTimelineData();
    const emociones = Array.from(new Set(data.map(d => d.emocion)));
    const etiquetasTraducidas = emociones.map(e => this.getEmotionLabel(e));

    const datasets = emociones.map(emocion => ({
      label: this.getEmotionLabel(emocion),
      data: data
        .filter(d => d.emocion === emocion)
        .map(d => ({ x: d.fecha, y: this.getEmotionLabel(emocion) })),
      showLine: false,
      pointRadius: 6,
      backgroundColor: this.getEmotionColor(emocion)
    }));

    new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'PPpp'
            },
            title: { display: true, text: 'Hora del reporte' }
          },
          y: {
            type: 'category',
            labels: etiquetasTraducidas,
            title: { display: true, text: 'Emoción detectada' }
          }
        }
      }
    });
  }


  getEmotionLabel(emotion: string): string {
    const map: { [key: string]: string } = {
      anger: 'Enojo',
      disgust: 'Disgusto',
      fear: 'Miedo',
      joy: 'Alegría',
      neutral: 'Neutral',
      sadness: 'Tristeza',
      surprise: 'Sorpresa'
    };
    return map[emotion] || emotion;
  }

  getEmotionFrequencyByDate() {
    const grouped: { [fecha: string]: { [emocion: string]: number } } = {};

    this.filteredReports.forEach(r => {
      const fecha = new Date(r.created_at!).toISOString().split('T')[0]; // Solo fecha
      const emocion = r.analysis?.emocion_detectada || 'Sin dato';
      if (!grouped[fecha]) grouped[fecha] = {};
      grouped[fecha][emocion] = (grouped[fecha][emocion] || 0) + 1;
    });

    return grouped;
  }


}
