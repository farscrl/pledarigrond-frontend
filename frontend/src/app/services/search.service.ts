import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { QueryResult } from '../models/query-result';

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

    return this.httpClient.get<QueryResult>("http://localhost:8080/search", httpOptions);
  }
}
