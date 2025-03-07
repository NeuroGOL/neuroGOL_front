import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NlpAnalysisModel } from '../../../core/models/nlp-analysis.model';
import { ReportsService } from '../../../core/services/reports.service';
import { ReportModel } from '../../../core/models/report.model';

@Component({
  selector: 'app-nlp-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nlp-analysis-modal.component.html',
  styleUrl: './nlp-analysis-modal.component.css'
})
export class NlpAnalysisModalComponent implements OnInit {
  @Input() analysis?: NlpAnalysisModel; // Recibe el análisis NLP
  @Input() playerId?: number; // 🔹 Recibe el ID del jugador
  @Input() isOpen = false; // Controla si el modal está abierto
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  isReportGenerated = false; // Estado del reporte
  isLoading = false;
  report?: ReportModel; // Para almacenar el reporte si ya existe

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    if (this.isOpen && this.analysis && this.playerId) {
      this.checkIfReportExists();
    }
  }

  ngOnChanges() {
    if (this.isOpen && this.analysis && this.playerId) {
      this.checkIfReportExists();
    }
  }

  /** 🔹 Verificar si el reporte ya existe */
  checkIfReportExists() {
    if (!this.analysis || !this.playerId || this.analysis.analysis_id === undefined || this.analysis.id === undefined) return;

    this.reportsService.getReportByAnalysis(
      this.analysis.analysis_id, 
      this.analysis.id, 
      this.playerId
    ).subscribe({
      next: (foundReport) => {
        if (foundReport) {
          this.isReportGenerated = true;
          this.report = foundReport;
        }
      },
      error: (err) => console.error('Error al verificar reportes:', err)
    });
  }

  /** 🔹 Generar un nuevo reporte si no existe */
  generateReport() {
    if (!this.analysis || !this.playerId || this.isReportGenerated) return;

    this.isLoading = true;
    const newReport: Partial<ReportModel> = {
      analysis_id: this.analysis.analysis_id,
      nlp_analysis_id: this.analysis.id,
      player_id: this.playerId, 
      generado_por: 1
    };

    this.reportsService.createReport(newReport).subscribe({
      next: (createdReport) => {
        this.isReportGenerated = true;
        this.report = createdReport;
        this.isLoading = false;
        console.log('✅ Reporte generado:', createdReport);
      },
      error: (err) => {
        console.error('Error al generar el reporte:', err);
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}
