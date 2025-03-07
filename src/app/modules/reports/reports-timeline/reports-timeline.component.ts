import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ReportModel } from '../../../core/models/report.model';
import { ReportsService } from '../../../core/services/reports.service';

// 🔹 Registra manualmente los módulos de Chart.js
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-reports-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-timeline.component.html',
  styleUrl: './reports-timeline.component.css'
})
export class ReportsTimelineComponent implements OnInit {
  reports: ReportModel[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportsService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.createTimelineChart();
      },
      error: (err) => console.error('Error al obtener reportes:', err)
    });
  }

  createTimelineChart() {
    const fechas = this.reports.map(r => r.created_at?.split('T')[0]);
    const valores = this.reports.map(() => Math.random() * 100);

    const chartConfig: ChartConfiguration<'line'> = {
      type: 'line', // 🔹 Asegúrate de que el tipo es 'line'
      data: {
        labels: fechas,
        datasets: [{
          label: 'Estado Emocional en el Tiempo',
          data: valores,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
          x: {}
        }
      }
    };

    new Chart('timelineChart', chartConfig);
  }
}
