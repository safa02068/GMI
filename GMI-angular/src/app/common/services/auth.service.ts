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

  /*
    Response body
    Download
    {
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3NDU2Njc1MzQsImlhdCI6MTc0NTU4MTEzNH0.QXOa_D84ZtNqpwXhz6cETBdWDUyB0xh3dfUbYlsg-M09IoFJPidPdKiQ6SMEjRhas0_a9iwb5Xx3isxZF3FFXg",
      "type": "Bearer",
      "message": "Login Succefully",
      "profil": "ADMIN",
      "email": "admin@gmail.com",
      "id": 1
    }
  */
export interface AuthResponse {
   token: string;
   email: string;
   profil: string;
   id: number;
  //accessToken: string;
  //refreshToken: string;
 // user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  //private readonly API_URL = 'http://localhost:8080';
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Load user from localStorage on service initialization
    if (this.isBrowser) {
      const user = localStorage.getItem('user');
      if (user) {
        this.userSubject.next(JSON.parse(user));
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

  logout(): void {
    // Clear the user state
    this.userSubject.next(null);
    
    // Clear tokens and user data from localStorage
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    
    // Clear the token refresh timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    // Call the backend logout endpoint
    this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe({
      next: () => {
        // Navigate to sign-in page after successful logout
        this.router.navigate(['/authentication/sign-in']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to sign-in page even if backend logout fails
        this.router.navigate(['/authentication/sign-in']);
      }
    });
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