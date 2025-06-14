import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface User {
  email: string;
  token:any ;
  roles: any;
}

export interface AuthResponse {
   token: string;
   email: string;
   profil: string;
   id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      if (token && email && role) {
        const user: User = {
          email: email,
          token: token,
          roles: role
        };
        this.userSubject.next(user);
      }
    }
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    console.log(!!this.currentUser)
    return !!this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.roles.includes(role) || false;
  }

  login(email: string, password: string): Observable<AuthResponse> { //badlou el path
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        })
      );
  }

  mpoublier(email: string){ //badlou el path
    return this.http.post<any>(`${this.API_URL}/users/renitialisermp?email=`+email,{})
    
  }

  newmp(id: string,password:any){ //badlou el path
    return this.http.post<any>(`${this.API_URL}/users/modifiermp?id=`+id+"&password="+password,{})
    
  }


  register(email: string, password: string): Observable<AuthResponse> { //badlou el path
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, { email, password })
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        })
      );
  }

  logout(){
    console.log("//")
         localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
       this.router.navigate(['/authentication']);
}

  refreshToken(): Observable<AuthResponse> {
    if (!this.isBrowser) {
      return new Observable<AuthResponse>();
    }
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        })
      );
  }
  

  private handleAuthentication(response: AuthResponse): void {
    console.log(response)
    const user:User =
{
email : response.email,
token:response.token,
roles:response.profil
    }
    this.userSubject.next(user);
    if (this.isBrowser) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', user.roles);
    }
    // Set up token refresh timer
    this.setTokenRefreshTimer();
  }

  private setTokenRefreshTimer(): void {
    if (!this.isBrowser) return;
    
    const expirationTime = 14 * 60 * 1000; // 14 minutes
    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, expirationTime);
  }


  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const token = localStorage.getItem('accessToken');
    return !!token && !!this.currentUser;
  }
} 