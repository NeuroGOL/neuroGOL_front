import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ReportModel } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/reports`;
  private reports: ReportModel[] = []; // Cache para evitar múltiples solicitudes

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener todos los reportes del backend */
  getReports(): Observable<ReportModel[]> {
    return this.http.get<ReportModel[]>(this.apiUrl).pipe(
      tap(reports => this.cacheReports(reports)) // Guardamos en caché
    );
  }

  /** 🔹 Guardar reportes en caché (ahora es pública) */
  cacheReports(reports: ReportModel[]) {
    this.reports = reports;
  }

  /** 🔹 Obtener reportes paginados desde la caché */
  getPaginatedReports(page: number, pageSize: number): ReportModel[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.reports.slice(startIndex, endIndex);
  }

  /** 🔹 Obtener un reporte por `analysis_id`, `nlp_analysis_id` y `player_id` */
  getReportByAnalysis(analysisId: number, nlpAnalysisId: number, playerId: number): Observable<ReportModel | null> {
    return new Observable(observer => {
      this.getReports().subscribe({
        next: (reports) => {
          const foundReport = reports.find(report => 
            report.analysis_id === analysisId &&
            report.nlp_analysis_id === nlpAnalysisId &&
            report.player_id === playerId
          );
          observer.next(foundReport || null);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** 🔹 Crear un nuevo reporte si no existe */
createReport(report: Partial<ReportModel>): Observable<ReportModel> {
  return new Observable(observer => {
    this.getReportByAnalysis(report.analysis_id!, report.nlp_analysis_id!, report.player_id!).subscribe({
      next: (foundReport) => {
        if (foundReport) {
          console.warn('⚠️ El reporte ya existe:', foundReport);
          observer.next(foundReport); // No crear duplicados, devolver el existente
          observer.complete();
        } else {
          this.http.post<ReportModel>(this.apiUrl, report).subscribe({
            next: (newReport) => {
              this.reports.push(newReport); // Agregarlo a la caché
              observer.next(newReport);
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        }
      },
      error: (err) => observer.error(err)
    });
  });
}
}
