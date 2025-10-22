import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { User } from '../models/user';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private httpClient = inject(HttpClient);

  private usersBasePath = '/admin/users';

  /**
   * Get a page of all users. Index is 1-based.
   */
  getAll(page: number = 1, searchText?: string): Observable<Page<User>> {
    let params: HttpParams = new HttpParams().set('page', page - 1);
    if (searchText && searchText !== '') {
      params = params.set('searchText', searchText);
    }
    return this.httpClient.get<Page<User>>(this.getUsersUrl(), { params });
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
