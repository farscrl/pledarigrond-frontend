import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { QueryResult } from '../models/query-result';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  getResults(term: string): Observable<QueryResult> {
    let params: HttpParams = new HttpParams().set('searchPhrase', term);

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<QueryResult>(this.getSearchUrl(), httpOptions);
  }

  private getSearchUrl(): string {
    return environment.apiUrl + "/user/search";
  }
}
