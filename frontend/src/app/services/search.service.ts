import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { QueryResult } from '../models/query-result';
import { SearchCriteria } from '../models/search-criteria';
import { environment } from './../../environments/environment';
import { SelectedLanguageService } from './selected-language.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient, private selectedLanguageService: SelectedLanguageService) { }

  getResults(searchCriteria: SearchCriteria): Observable<QueryResult> {
    let params: HttpParams = new HttpParams();

    if (!!searchCriteria.searchPhrase && searchCriteria.searchPhrase !== "") {
      params = params.set('searchPhrase', searchCriteria.searchPhrase);
    }

    if (!!searchCriteria.searchDirection && searchCriteria.searchDirection !== 'BOTH') {
      params = params.set('searchDirection', searchCriteria.searchDirection);
    }

    if (!!searchCriteria.searchMethod && searchCriteria.searchMethod !== 'NORMAL') {
      params = params.set('searchMethod', searchCriteria.searchMethod);
    }

    if (!!searchCriteria.suggestions && (searchCriteria.suggestions)) {
      params = params.set('suggestions', searchCriteria.suggestions);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<QueryResult>(this.getSearchUrl(), httpOptions);
  }

  private getSearchUrl(): string {
    return environment.apiUrl + "/user/search";
  }
}
