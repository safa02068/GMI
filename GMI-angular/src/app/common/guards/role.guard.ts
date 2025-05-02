import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: any): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[];
    console.log(requiredRoles)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!this.authService.isAuthenticated) {
      return this.router.createUrlTree(['/authentication/sign-in']);
    }

    const hasRequiredRole = requiredRoles.some(role => this.authService.hasRole(role));
    if (!hasRequiredRole) {
      return this.router.createUrlTree(['/authentication/not-authorized']);
    }

    return true;
  }

} 