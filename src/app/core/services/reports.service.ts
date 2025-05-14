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
  private reports: ReportModel[] = []; // Caché para evitar múltiples solicitudes

  constructor(private http: HttpClient) { }

  /** 🔹 Obtener todos los reportes del backend */
  getReports(): Observable<ReportModel[]> {
    return this.http.get<ReportModel[]>(this.apiUrl).pipe(
      tap(reports => this.reports = reports) // Guardamos en caché
    );
  }

  /** 🔹 Obtener reportes paginados desde la caché */
  getPaginatedReports(page: number, pageSize: number): ReportModel[] {
    const startIndex = (page - 1) * pageSize;
    return this.reports.slice(startIndex, startIndex + pageSize);
  }

  /** 🔹 Crear un nuevo reporte usando `declaration_id` en lugar de `analysis_id` */
  createReport(declaration_id: number, nlp_analysis_id: number, generado_por: number, player_id: number): Observable<ReportModel> {
    const reportData: Partial<ReportModel> = {
      declaration_id,
      nlp_analysis_id,
      generado_por,
      player_id
    };

    return this.http.post<ReportModel>(this.apiUrl, reportData).pipe(
      tap(newReport => this.reports.push(newReport)) // Agregar a la caché solo si se crea correctamente
    );
  }
}
