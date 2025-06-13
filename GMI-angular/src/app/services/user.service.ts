import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface User {
  nom: string;
  prenom: string;
  poste: string;
  p: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize user data from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  getData(){
    let headersaaaa = new HttpHeaders();
    headersaaaa = headersaaaa.set('Content-Type', 'application/json; charset=utf-8');
    headersaaaa = headersaaaa.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    console.log(localStorage.getItem('token'))
    return this.http.get(`${this.apiUrl}/all`,{headers:headersaaaa});
  }

  getUserByEmail(email: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    return this.http.get(`${this.apiUrl}/afficherbyemail?email=${email}`, {headers: headers});
  }

  getMyProfile(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    return this.http.get(`${this.apiUrl}/my-profile`, {headers: headers});
  }
  
  modifierUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/modifier`, userData);
  }

  updateProfile(userData: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    return this.http.post(`${this.apiUrl}/update-profile`, userData, {headers: headers});
  }

  deleteUser(idUser: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${idUser}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, user);
  }

  setUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}
