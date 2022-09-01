import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../models/page";
import {environment} from "../../environments/environment";
import {Name} from "../models/name";

@Injectable({
  providedIn: 'root'
})
export class NameService {

  private namesBasePath = '/editor/names';

  constructor(private httpClient: HttpClient) { }

  getAll(pageNumber: number, pageSize: number): Observable<Page<Name>> {
    let params: HttpParams = new HttpParams();
    if (pageNumber !== 0) {
      params = params.set('page', pageNumber);
    }
    if (pageSize !== 15) {
      params = params.set('pageSize', pageSize);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<Page<Name>>(this.getNamesUrl(), httpOptions);
  }

  getOne(id: string): Observable<Name> {
    return this.httpClient.get<Name>(this.getNamesUrl(id));
  }

  create(name: Name) {
    const body: any = Object.assign({}, name);
    return this.httpClient.post<Name>(this.getNamesUrl(), body);
  }

  update(id: string, name: Name): Observable<Name> {
    const body: any = Object.assign({}, name);
    return this.httpClient.put<Name>(this.getNamesUrl(id), body);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.getNamesUrl(id));
  }

  private getNamesUrl(id?: string) {
    const base = environment.apiUrl + this.namesBasePath;
    if (!id) {
      return base;
    }
    return base + '/' + encodeURIComponent(id);
  }
}
