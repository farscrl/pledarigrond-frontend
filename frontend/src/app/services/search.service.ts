import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryResult } from '../models/query-result';
import { SearchCriteria } from '../models/search-criteria';
import { Language } from '../models/security';
import { environment } from './../../environments/environment';
import { SelectedLanguageService } from './selected-language.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient, private selectedLanguageService: SelectedLanguageService) { }

  getResults(language: string, searchCriteria: SearchCriteria): Observable<QueryResult> {
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

    return this.httpClient.get<QueryResult>(this.getSearchUrl(language), httpOptions);
  }

  private getSearchUrl(language: string): string {
    return environment.apiUrl + "/" + language + "/user/search";
  }
}
