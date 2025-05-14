import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DeclarationModel } from '../models/declaration.model';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  private apiUrl = `${environment.apiUrl}/declarations`; // 🔹 Ruta actualizada

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener todas las declaraciones */
  getDeclarations(): Observable<DeclarationModel[]> {
    return this.http.get<DeclarationModel[]>(this.apiUrl);
  }

  /** 🔹 Crear una nueva declaración */
  createDeclaration(declaration: Partial<DeclarationModel>): Observable<DeclarationModel> {
    return this.http.post<DeclarationModel>(this.apiUrl, declaration);
  }

  /** 🔹 Obtener una declaración por ID */
  getDeclarationById(id: number): Observable<DeclarationModel> {
    return this.http.get<DeclarationModel>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Actualizar una declaración */
  updateDeclaration(declaration: DeclarationModel): Observable<DeclarationModel> {
    return this.http.put<DeclarationModel>(`${this.apiUrl}/${declaration.id}`, declaration);
  }

  /** 🔹 Eliminar una declaración */
  deleteDeclaration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
