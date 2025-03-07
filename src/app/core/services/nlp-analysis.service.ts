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

  getAllNlpAnalyses(): Observable<NlpAnalysisModel[]> {
    return this.http.get<NlpAnalysisModel[]>(this.apiUrl);
  }

  generateNlpAnalysis(playerId: number): Observable<NlpAnalysisModel> {
    return this.http.post<NlpAnalysisModel>(`${this.apiUrl}`, { analysis_id: playerId });
  }
}
