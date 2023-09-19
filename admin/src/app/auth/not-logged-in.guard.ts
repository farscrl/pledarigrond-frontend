import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs';
import { UserLoggedInGuard } from './logged-in.guard';

@Injectable()
export class UserNotLoggedInGuard  {

  constructor(private userLoggedInGuard: UserLoggedInGuard) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return !this.userLoggedInGuard.canActivate(next,state);
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if (!route.path) {
      return false;
    }
    return !this.userLoggedInGuard.canLoad(route);
  }
}
