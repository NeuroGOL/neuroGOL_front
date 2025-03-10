import { Component } from '@angular/core';
import { ReportsService } from '../../../core/services/reports.service';
import { CommonModule } from '@angular/common';
import { ReportModel } from '../../../core/models/report.model';
import { ReportsChartComponent } from "../reports-chart/reports-chart.component";
import { ReportsTimelineComponent } from "../reports-timeline/reports-timeline.component";

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, ReportsChartComponent, ReportsTimelineComponent],
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.css'
})
export class ReportsListComponent {
  reports: ReportModel[] = [];
  page = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportsService.getReports().subscribe({
      next: (data) => {
        this.reports = data; // Cargar reportes directamente
        this.totalPages = Math.ceil(this.reports.length / this.pageSize);
        this.updatePage();
      },
      error: (err) => console.error('Error al obtener reportes:', err)
    });
  }

  updatePage() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.reports = this.reports.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }
}
