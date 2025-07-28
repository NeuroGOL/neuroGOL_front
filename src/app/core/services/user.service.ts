import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/${user.id}`, user);
  }
}
