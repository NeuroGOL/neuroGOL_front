import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { NlpAnalysisModel } from '../models/nlp-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class NlpAnalysisService {
  private apiUrl = `${environment.apiUrl}/nlp`;

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener todos los análisis NLP */
  getAllNlpAnalyses(): Observable<NlpAnalysisModel[]> {
    return this.http.get<NlpAnalysisModel[]>(this.apiUrl);
  }

  /** 🔹 Obtener análisis NLP por declaración */
  getAnalysisByDeclaration(declarationId: number): Observable<NlpAnalysisModel | null> {
    return this.http.get<NlpAnalysisModel | null>(`${this.apiUrl}/declaration/${declarationId}`);
  }

  /** 🔹 Generar un análisis NLP para una declaración */
  generateNlpAnalysis(declarationId: number): Observable<NlpAnalysisModel> {
    console.log('📤 Enviando datos al backend:', { declaration_id: declarationId });
  
    return this.http.post<NlpAnalysisModel>(`${this.apiUrl}`, { declaration_id: declarationId });
  }
  
  /** 🔹 Eliminar un análisis NLP */
  deleteNlpAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
