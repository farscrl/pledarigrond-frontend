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

  private role: Role|null = null;
  private langages: Language[] = [];

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>("");

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
    return this.hasSystemRole(Role.ROLE_ADMIN);
  }

  isEditorPuter() {
    return this.hasSystemRole(Role.ROLE_EDITOR_PUTER);
  }

  isEditorRumantschgrischun() {
    return this.hasSystemRole(Role.ROLE_EDITOR_RUMANTSCHGRISCHUN);
  }

  isEditorSurmiran() {
    return this.hasSystemRole(Role.ROLE_EDITOR_SURMIRAN);
  }

  isEditorSursilvan() {
    return this.hasSystemRole(Role.ROLE_EDITOR_SURSILVAN);
  }

  isEditorSutsilvan() {
    return this.hasSystemRole(Role.ROLE_EDITOR_SUTSILVAN);
  }

  isEditorVallader() {
    return this.hasSystemRole(Role.ROLE_EDITOR_VALLADER);
  }

  isEditorNames() {
    return this.hasSystemRole(Role.ROLE_EDITOR_NAMES);
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
    this.role = null;
  }

  private resolveFeatures(token: string) {
    const jwtToken = this.jwtHelperService.decodeToken(token);
    this.isLoggedInSubject.next(true);
    this.usernameSubject.next(jwtToken.sub);
  }

  hasSystemRole(role: Role) {
    return this.isLoggedIn() && this.role === role;
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
      return jwtToken.email;
    }
    return '';
  }

  private getAuthRestUrl(path: string): string {
    return environment.apiUrl.concat(path);
  }

  private getRoles(): string[] {
    if (this.token) {
      const jwtToken = this.jwtHelperService.decodeToken(this.token);
      return jwtToken.role;
    } else {
      return [];
    }
  }
}
