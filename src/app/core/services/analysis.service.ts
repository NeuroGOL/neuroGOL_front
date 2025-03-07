import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AnalysisModel } from '../models/analysis.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = `${environment.apiUrl}/analysis`;

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener todos los análisis */
  getAnalysis(): Observable<AnalysisModel[]> {
    return this.http.get<AnalysisModel[]>(this.apiUrl);
  }

  /** 🔹 Crear un nuevo análisis */
  createAnalysis(analysis: Partial<AnalysisModel>): Observable<AnalysisModel> {
    return this.http.post<AnalysisModel>(this.apiUrl, analysis);
  }

  /** 🔹 Obtener un análisis por ID */
  getAnalysisById(id: number): Observable<AnalysisModel> {
    return this.http.get<AnalysisModel>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Actualizar un análisis */
  updateAnalysis(analysis: AnalysisModel): Observable<AnalysisModel> {
    return this.http.put<AnalysisModel>(`${this.apiUrl}/${analysis.id}`, analysis);
  }

  /** 🔹 Eliminar un análisis */
  deleteAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
