import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getData(){
          let headersaaaa = new HttpHeaders();
          headersaaaa = headersaaaa.set('Content-Type', 'application/json; charset=utf-8');
          headersaaaa = headersaaaa.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    return this.http.get(`${this.apiUrl}/all`,{headers:headersaaaa});
  }

  modifierUser(userData: any): Observable<any> {
       let headersaaaa = new HttpHeaders();
          headersaaaa = headersaaaa.set('Content-Type', 'application/json; charset=utf-8');
          headersaaaa = headersaaaa.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    return this.http.post(`${this.apiUrl}/modifier`, userData,{headers:headersaaaa});
  }

  deleteUser(idUser: number): Observable<any> {
           let headersaaaa = new HttpHeaders();
          headersaaaa = headersaaaa.set('Content-Type', 'application/json; charset=utf-8');
          headersaaaa = headersaaaa.set("Authorization", 'Bearer ' + localStorage.getItem('token'));

    return this.http.delete(`${this.apiUrl}/delete/${idUser}`,{headers:headersaaaa});
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, user);
  }
}
