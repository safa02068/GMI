import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    let isRefreshing = false;

    // Skip token for auth endpoints
    if (req.url.includes('/auth/')) {
        return next(req);
    }

    // Only add token in browser environment
    if (isPlatformBrowser(platformId)) {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isRefreshing && isPlatformBrowser(platformId)) {
                isRefreshing = true;

                return authService.refreshToken().pipe(
                    switchMap((response) => {
                        isRefreshing = false;
                        return next(req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${response.token}`
                            }
                        }));
                    }),
                    catchError((refreshError) => {
                        isRefreshing = false;
                        authService.logout();
                        router.navigate(['/authentication/sign-in']);
                        return throwError(() => refreshError);
                    })
                );
            }
            return throwError(() => error);
        })
    );
}; 