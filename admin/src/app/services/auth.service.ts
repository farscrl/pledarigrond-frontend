import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Credentials, Language, Role } from '../models/security';

const TOKEN_KEY = 'jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBasePath = '/user/token';
  private token = '';

  private roles: Role[] = [];

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>("");
  private editorRightsSubject = new BehaviorSubject<boolean>(false);

  constructor(
      private jwtHelperService: JwtHelperService,
      private httpClient: HttpClient
  ) {
    this.setToken(localStorage.getItem(TOKEN_KEY));
  }

  getLoggedInObservable(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable()
  }

  getUsernameObservable(): Observable<string> {
    return this.usernameSubject.asObservable()
  }

  hasEditorRightsObservable(): Observable<boolean> {
    return this.editorRightsSubject.asObservable();
  }

  isLoggedIn(): boolean {
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return this.token ? true : false;
  }

  isTokenExpired(): boolean {
    return !!this.token && this.jwtHelperService.isTokenExpired(this.token);
  }

  login(credentials: Credentials): Observable<any> {
    return this.httpClient.post(this.getAuthRestUrl(this.authBasePath), credentials);
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next("");

    this.token = '';
    localStorage.removeItem(TOKEN_KEY);
  }

  authSuccess(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.setToken(token);
  }

  getToken(): string {
    return this.token;
  }

  isAdmin(): boolean {
    return this.hasSystemRole('ROLE_ADMIN');
  }

  isEditorPuter() {
    return this.hasSystemRole('ROLE_EDITOR_PUTER') || this.isAdmin();
  }

  isEditorRumantschgrischun() {
    return this.hasSystemRole('ROLE_EDITOR_RUMANTSCHGRISCHUN') || this.isAdmin();
  }

  isEditorSurmiran() {
    return this.hasSystemRole('ROLE_EDITOR_SURMIRAN') || this.isAdmin();
  }

  isEditorSursilvan() {
    return this.hasSystemRole('ROLE_EDITOR_SURSILVAN') || this.isAdmin();
  }

  isEditorSutsilvan() {
    return this.hasSystemRole('ROLE_EDITOR_SUTSILVAN') || this.isAdmin();
  }

  isEditorVallader() {
    return this.hasSystemRole('ROLE_EDITOR_VALLADER') || this.isAdmin();
  }

  isEditorNames() {
    return this.hasSystemRole('ROLE_EDITOR_NAMES') || this.isAdmin();
  }

  private setToken(token: string|null) {
    if (token) {
      this.reset();
      this.token = token;
      this.resolveFeatures(token);
    }
  }

  private reset() {
    this.token = '';
    this.roles = [];
  }

  private resolveFeatures(token: string) {
    const jwtToken = this.jwtHelperService.decodeToken(token);
    this.isLoggedInSubject.next(true);
    this.usernameSubject.next(jwtToken.sub);
    this.roles = jwtToken.roles;

    if (this.isAdmin() || this.isEditorPuter() || this.isEditorRumantschgrischun() || this.isEditorSurmiran() || this.isEditorSursilvan() || this.isEditorSutsilvan() || this.isEditorVallader() || this.isEditorNames()) {
      this.editorRightsSubject.next(true);
    } else {
      this.editorRightsSubject.next(false);
    }
  }

  hasSystemRole(role: Role) {
    return this.isLoggedIn() && this.roles.includes(role);
  }

  public getId() {
    if (this.token) {
      const jwtToken = this.jwtHelperService.decodeToken(this.token);
      return jwtToken.id;
    }
    return '';
  }

  public getUsername() {
    if (this.token) {
      const jwtToken = this.jwtHelperService.decodeToken(this.token);
      return jwtToken.sub;
    }
    return '';
  }

  private getAuthRestUrl(path: string): string {
    return environment.apiUrl.concat(path);
  }
}
