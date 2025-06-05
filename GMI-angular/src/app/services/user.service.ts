import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getData(){
          let headersaaaa = new HttpHeaders();
          headersaaaa = headersaaaa.set('Content-Type', 'application/json; charset=utf-8');
          headersaaaa = headersaaaa.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
          console.log(localStorage.getItem('token'))
    return this.http.get(`${this.apiUrl}/all`,{headers:headersaaaa});
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
