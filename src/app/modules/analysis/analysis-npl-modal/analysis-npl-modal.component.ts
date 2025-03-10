import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class AnalysisNplModalComponent {
  @Input() analysis?: NlpAnalysisModel; // 🔹 Recibe el análisis NLP
  @Input() isOpen = false; // 🔹 Controla si el modal está abierto
  @Input() declaration_id?: number; // 🔹 Se recibe la declaración para generar reporte
  @Input() player_id?: number; // 🔹 Se recibe el jugador para generar reporte
  @Output() close = new EventEmitter<void>(); // 🔹 Evento para cerrar el modal
  @Output() reportGenerated = new EventEmitter<number>(); // 🔹 Evento para notificar reporte generado

  isLoading = false; // 🔹 Estado de carga

  constructor(
    private reportsService: ReportsService,
    private notificationService: NotificationService
  ) { }

  /** 🔹 Cerrar modal */
  closeModal() {
    this.close.emit();
  }

  /** 🔹 Generar reporte */
  generateReport() {
    if (!this.analysis?.id || !this.declaration_id || !this.player_id) return;

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
