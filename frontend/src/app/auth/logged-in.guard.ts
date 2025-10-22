import { AuthService } from '../services/auth.service';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable()
export class UserLoggedInGuard  {
  private authService = inject(AuthService);
  private router = inject(Router);


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.isAuthenticated(next.data, encodeURI(state.url));
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if (!route.path) {
      return false;
    }
    return this.isAuthenticated(route.data, encodeURI(route.path));
  }

  isAuthenticated(data: any, redirect: string): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    return true;
  }
}
