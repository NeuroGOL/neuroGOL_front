import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { ReportsService } from '../../../core/services/reports.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analysis-npl-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-npl-modal.component.html',
  styleUrl: './analysis-npl-modal.component.css'
})
export class AnalysisNplModalComponent implements OnChanges {
  @Input() analysis?: NlpAnalysisModel;
  @Input() isOpen = false;
  @Input() declaration_id?: number;
  @Input() player_id?: number;
  @Output() close = new EventEmitter<void>();
  @Output() reportGenerated = new EventEmitter<number>();

  isLoading = false;
  hasReport = false;

  constructor(
    private reportsService: ReportsService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.declaration_id && this.player_id) {
      this.checkIfReportExists();
    }
  }

  /** 🔍 Verificar si ya hay reporte */
  checkIfReportExists() {
    this.reportsService.getReports().subscribe({
      next: (reports) => {
        this.hasReport = reports.some(report =>
          report.declaration_id === this.declaration_id &&
          report.player_id === this.player_id
        );
      },
      error: () => {
        this.notificationService.showError('No se pudo verificar si el reporte ya existe.');
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  generateReport() {
    if (!this.analysis?.id || !this.declaration_id || !this.player_id) {
      this.notificationService.showError('Faltan datos para generar el reporte.');
      return;
    }

    if (this.hasReport) {
      this.notificationService.showWarning('Ya existe un reporte para esta declaración.');
      return;
    }

    this.isLoading = true;

    this.reportsService.createReport(this.declaration_id, this.analysis.id, 1, this.player_id).subscribe({
      next: (report) => {
        this.isLoading = false;
        this.notificationService.showSuccess('Reporte generado correctamente.');
        this.reportGenerated.emit(report.id);
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al generar reporte:', err);
        this.notificationService.showError('Error al generar reporte.');
      }
    });
  }
}