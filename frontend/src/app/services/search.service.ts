import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LemmaVersion } from '../models/lemma-version';
import { Page } from '../models/page';
import { SearchCriteria } from '../models/search-criteria';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  getResults(language: string, searchCriteria: SearchCriteria, page = 1): Observable<Page<LemmaVersion>> {
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

    if (page !== 0) {
      params = params.set('page', page);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<Page<LemmaVersion>>(this.getSearchUrl(language), httpOptions);
  }

  private getSearchUrl(language: string): string {
    return environment.apiUrl + "/" + language + "/user/search";
  }
}
