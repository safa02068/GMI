import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8081/users'; 
  constructor(private http: HttpClient) {
   }
  getData(): Observable<any> {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/all`, { headers });
  }
    modifierUser(userData: any): Observable<any> {
      const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    
      return this.http.post(`${this.apiUrl}/modifier`, userData, { headers });
    }
    deleteUser(idUser: number): Observable<any> {
      const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    
      return this.http.delete(`${this.apiUrl}/delete/${idUser}`, { headers });
    }
    addUser(user: any): Observable<any> {
  const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.post(`${this.apiUrl}/add`, user, { headers });
}
}
