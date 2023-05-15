import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs';
import { Role } from '../models/security';

@Injectable()
export class UserLoggedInGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isAuthenticated(next.data)) {
      return false;
    }

    if (!this.hasAnyPermissions()) {
      return false;
    }

    if (next && next.data && next.data['expected_role']) {
      const role = next.data['expected_role'];
      const hasRole = this.hasRequestedRole(role);
      if (hasRole) {
        return true;
      }
      this.router.navigate(['/admin']);
    }
    return true;
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if (!route.path) {
      return false;
    }
    return this.isAuthenticated(route.data);
  }

  isAuthenticated(data: any): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      if (data.redirectToLogin) {
        this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }

  private hasAnyPermissions():boolean {
    if (
      !this.authService.isEditorPuter() &&
      !this.authService.isEditorRumantschgrischun() &&
      !this.authService.isEditorSursilvan() &&
      !this.authService.isEditorSurmiran() &&
      !this.authService.isEditorSutsilvan() &&
      !this.authService.isEditorVallader() &&
      !this.authService.isEditorNames()
    ) {
      this.router.navigate(['/no-permissions']);
      return false;
    }
    return true;
  }

  private hasRequestedRole(role: Role): boolean {
    switch(role) {
      case 'ROLE_ADMIN': return this.authService.isAdmin();
      case 'ROLE_EDITOR_PUTER': return this.authService.isEditorPuter();
      case 'ROLE_EDITOR_RUMANTSCHGRISCHUN': return this.authService.isEditorRumantschgrischun();
      case 'ROLE_EDITOR_SURMIRAN': return this.authService.isEditorSurmiran();
      case 'ROLE_EDITOR_SURSILVAN': return this.authService.isEditorSursilvan();
      case 'ROLE_EDITOR_SUTSILVAN': return this.authService.isEditorSutsilvan();
      case 'ROLE_EDITOR_VALLADER': return this.authService.isEditorVallader();
      case 'ROLE_EDITOR_NAMES': return this.authService.isEditorNames();
      default: return false;
    }
  }
}
