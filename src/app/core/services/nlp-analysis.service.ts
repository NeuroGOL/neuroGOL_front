import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.production';
import { NlpAnalysisModel } from '../models/nlp-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class NlpAnalysisService {
  private apiUrl = `${environment.apiUrl}/nlp`;

  constructor(private http: HttpClient) { }

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
    const payload = { declaration_id: declarationId };

    // Loguear todo el JSON que se enviará
    console.log('📤 JSON enviado al backend:', JSON.stringify(payload, null, 2));

    return this.http.post<NlpAnalysisModel>(
      `${this.apiUrl}`,
      payload
      // observe: 'body' is the default and returns the typed body (NlpAnalysisModel)
    ).pipe(
      tap(res => {
        console.log('✅ Respuesta del backend (body):', res);
      }),
      catchError(err => {
        console.error('❌ Error completo del backend:', err);
        if (err.error) {
          console.error('📄 Body del error:', err.error);
        }
        return throwError(() => err);
      })
    );
  }


  /** 🔹 Eliminar un análisis NLP */
  deleteNlpAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
