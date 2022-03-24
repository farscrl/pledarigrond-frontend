import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { User } from '../models/user';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersBasePath = '/admin/users';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Page<User>> {
    return this.httpClient.get<Page<User>>(this.getUsersUrl());
  }

  getOne(email: string): Observable<User> {
    return this.httpClient.get<User>(this.getUsersUrl(email));
  }

  create(user: User) {
    const body: any = Object.assign({}, user);
    return this.httpClient.post<User>(this.getUsersUrl(), body);
  }

  update(email: string, user: User): Observable<User> {
    if (!user.password || user.password === '') {
      delete user.password;
    }
    const body: any = Object.assign({}, user);
    return this.httpClient.put<User>(this.getUsersUrl(email), body);
  }

  delete(email: string): Observable<void> {
    return this.httpClient.delete<void>(this.getUsersUrl(email));
  }

  private getUsersUrl(id?: string) {
    const base = environment.apiUrl + this.usersBasePath;
    if (!id) {
      return base;
    }
    return base + '/' + encodeURIComponent(id);
  }
}
