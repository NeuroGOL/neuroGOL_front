import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ReportModel } from '../../../core/models/report.model';
import { ReportsService } from '../../../core/services/reports.service';

// 🔹 Registra manualmente los módulos de Chart.js
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-reports-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-chart.component.html',
  styleUrl: './reports-chart.component.css'
})
export class ReportsChartComponent implements OnInit {
  reports: ReportModel[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportsService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.createChart();
      },
      error: (err) => console.error('Error al obtener reportes:', err)
    });
  }

  createChart() {
    const fechas = this.reports.map(r => r.created_at?.split('T')[0]);
    const valores = this.reports.map(() => Math.random() * 100); // Simulación de datos

    const chartConfig: ChartConfiguration<'bar'> = {
      type: 'bar', // 🔹 Asegúrate de que el tipo es 'bar'
      data: {
        labels: fechas,
        datasets: [{
          label: 'Tendencia Emocional (%)',
          data: valores,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
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

    new Chart('reportChart', chartConfig);
  }
}
