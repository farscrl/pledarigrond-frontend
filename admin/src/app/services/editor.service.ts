import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

    if (page !== 0) {
      params = params.set('page', page);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<Page<LexEntry>>(this.generateUrl(language, 'lex_entries'), httpOptions);
  }

  searchLemmaVersions(language: Language, searchCriteria: SearchCriteria, page: number): Observable<Page<LemmaVersion>> {
    let params: HttpParams = new HttpParams();

    params = this.searchCriteriaToHttpParam(searchCriteria, params);

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

  newLexEntry(language: Language, lexEntry: LexEntry) {
    const body: any = Object.assign({}, lexEntry);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/'), body);
  }

  modifyAndAccepptLexEntry(language: Language, entryId: string, lemmaVersion: LemmaVersion) {
    const body: any = Object.assign({}, lemmaVersion);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/modify_and_accept_version'), body);
  }

  dropEntry(language: Language, entryId: string) {
    return this.httpClient.delete<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId));
  }

  rejectEntry(language: Language, entryId: string, lemmaVersion: LemmaVersion) {
    const body: any = Object.assign({}, lemmaVersion);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/reject_version'), body);
  }

  getChoiceFieldsSuggestions(language: Language) {
    return this.httpClient.get<any>(this.generateUrl(language, 'search_suggestions_choice'));
  }

  exportFieldsByEditorQuery(language: Language, editorQuery: EditorQuery, fields: string[]): Observable<Blob> {
    let params: HttpParams = new HttpParams();

    params = this.editorQueryToHttpParam(editorQuery, params);
    const body: any = Object.assign({}, { fields: fields });

    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');

    const httpOptions = {
      params: params,
      headers: zipHeaders,
      responseType: 'blob' as 'json',
    };

    return this.httpClient.post<Blob>(this.generateUrl(language, 'lex_entries_export'), body, httpOptions);
  }

  exportFieldsBySearchCriteria(language: Language, searchCriteria: SearchCriteria, fields: string[]): Observable<Blob> {
    let params: HttpParams = new HttpParams();

    params = this.searchCriteriaToHttpParam(searchCriteria, params);
    const body: any = Object.assign({}, { fields: fields });

    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');

    const httpOptions = {
      params: params,
      headers: zipHeaders,
      responseType: 'blob' as 'json',
    };

    return this.httpClient.post<Blob>(this.generateUrl(language, 'search_export'), body, httpOptions);
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

  private searchCriteriaToHttpParam(searchCriteria: SearchCriteria, params: HttpParams): HttpParams {
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

    return params;
  }
}
