import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  modifierUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/modifier`, userData);
  }

  deleteUser(idUser: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${idUser}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, user);
  }
}
