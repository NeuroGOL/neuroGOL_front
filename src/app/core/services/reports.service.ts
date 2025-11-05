import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment.production';
import { ReportModel } from '../models/report.model';
import { NlpAnalysisModel } from '../models/nlp-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/reports`;
  private analysesUrl = `${environment.apiUrl}/nlp`;
  private reports: (ReportModel & { analysis?: NlpAnalysisModel })[] = []; // Caché con analysis incluido

  constructor(private http: HttpClient) { }

  /** 🔹 Obtener todos los reportes junto con su análisis */
  getReports(): Observable<(ReportModel & { analysis?: NlpAnalysisModel })[]> {
    return forkJoin({
      reports: this.http.get<ReportModel[]>(this.apiUrl),
      analyses: this.http.get<NlpAnalysisModel[]>(this.analysesUrl)
    }).pipe(
      map(({ reports, analyses }) => {
        // Asociar cada reporte con su análisis
        return reports.map(r => ({
          ...r,
          analysis: analyses.find(a => a.id === r.nlp_analysis_id)
        }));
      }),
      tap(reportsWithAnalysis => this.reports = reportsWithAnalysis)
    );
  }

  /** 🔹 Obtener reportes paginados desde la caché */
  getPaginatedReports(page: number, pageSize: number): (ReportModel & { analysis?: NlpAnalysisModel })[] {
    const startIndex = (page - 1) * pageSize;
    return this.reports.slice(startIndex, startIndex + pageSize);
  }

  /** 🔹 Crear un nuevo reporte */
  createReport(declaration_id: number, nlp_analysis_id: number, generado_por: number, player_id: number): Observable<ReportModel> {
    const reportData: Partial<ReportModel> = {
      declaration_id,
      nlp_analysis_id,
      generado_por,
      player_id
    };

    return this.http.post<ReportModel>(this.apiUrl, reportData).pipe(
      tap(newReport => this.reports.push(newReport))
    );
  }

  /** 🔹 Distribución de emociones */
  getEmotionDistribution(): { [emotion: string]: number } {
    const distribution: { [emotion: string]: number } = {};
    this.reports.forEach(r => {
      const emo = r.analysis?.emocion_detectada || 'Sin dato';
      distribution[emo] = (distribution[emo] || 0) + 1;
    });
    return distribution;
  }

  /** 🔹 Rendimiento promedio */
  getRendimientoPromedio(): number {
    if (!this.reports.length) return 0;
    const total = this.reports.reduce((acc, r) => {
      const val = r.analysis?.rendimiento_predicho;
      const num = typeof val === 'string' ? parseFloat(val) : (val ?? 0);
      const safeNum = Number.isFinite(Number(num)) ? Number(num) : 0;
      return acc + safeNum;
    }, 0);
    return total / this.reports.length;
  }

  /** 🔹 Lista de emociones únicas */
  getEmociones(): string[] {
    return Array.from(new Set(this.reports.map(r => r.analysis?.emocion_detectada || 'Sin dato')));
  }

}
