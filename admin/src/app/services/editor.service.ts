import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditorQuery } from '../models/editor-query';
import { LemmaVersion } from '../models/lemma-version';
import { LexEntry } from '../models/lex-entry';
import { Page } from '../models/page';
import { SearchCriteria } from '../models/search-criteria';
import { Language } from '../models/security';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private editorBasePath = '/editor/';

  constructor(private httpClient: HttpClient) { }

  getAllLexEntries(language: Language, editorQuery: EditorQuery, page: number): Observable<Page<LexEntry>> {
    let params: HttpParams = new HttpParams();

    params = this.editorQueryToHttpParam(editorQuery, params);

    if (page !== 1) {
      params = params.set('page', page);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<Page<LexEntry>>(this.generateUrl(language, 'lex_entries'), httpOptions);
  }

  searchLemmaVersions(language: Language, searchCriteria: SearchCriteria, page: number): Observable<Page<LemmaVersion>> {
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

    return this.httpClient.get<Page<LemmaVersion>>(this.generateUrl(language, 'search'), httpOptions);
  }

  getLexEntry(language: Language, id: string) {
    return this.httpClient.get<LexEntry>(this.generateUrl(language, 'lex_entries/' + id));
  }

  dropEntry(language: Language, lexEntry: LexEntry) {
    const body: any = Object.assign({}, lexEntry);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'drop_entry'), body);
  }

  getChoiceFieldsSuggestions(language: Language) {
    return this.httpClient.get<any>(this.generateUrl(language, 'search_suggestions_choice'));
  }

  private generateUrl(language: Language, segment: string) {
    return environment.apiUrl + "/" + language + this.editorBasePath + segment;
  }

  private editorQueryToHttpParam(editorQuery: EditorQuery, params: HttpParams): HttpParams {
    if (!!editorQuery.startTime) {
      params = params.set('startTime', editorQuery.startTime);
    }

    if (!!editorQuery.endTime) {
      params = params.set('endTime', editorQuery.endTime);
    }

    if (!!editorQuery.verification) {
      params = params.set('verification', editorQuery.verification);
    }

    if (!!editorQuery.userOrIp) {
      params = params.set('userOrIp', editorQuery.userOrIp);
    }

    if (!!editorQuery.verifier) {
      params = params.set('verifier', editorQuery.verifier);
    }

    return params;
  }
}
