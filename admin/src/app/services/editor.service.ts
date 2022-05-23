import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryLanguage } from '../models/dictionary-language';
import { EditorQuery } from '../models/editor-query';
import { LemmaVersion } from '../models/lemma-version';
import { LexEntry } from '../models/lex-entry';
import { Page } from '../models/page';
import { EditorSearchCriteria, SearchCriteria } from '../models/search-criteria';
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

  searchLemmaVersions(language: Language, searchCriteria: SearchCriteria, page: number, pageSize = 15): Observable<Page<LemmaVersion>> {
    let params: HttpParams = new HttpParams();

    params = this.searchCriteriaToHttpParam(searchCriteria, params);

    if (page !== 0) {
      params = params.set('page', page);
    }

    if (pageSize !== 15) {
      params = params.set('pageSize', pageSize);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<Page<LemmaVersion>>(this.generateUrl(language, 'search'), httpOptions);
  }

  getLexEntry(language: Language, id: string) {
    return this.httpClient.get<LexEntry>(this.generateUrl(language, 'lex_entries/' + id));
  }

  newLexEntry(language: Language, lexEntry: LexEntry, asSuggestion: boolean) {
    let params: HttpParams = new HttpParams();

    if (asSuggestion) {
      params = params.set('asSuggestion', true);
    }

    const httpOptions = {
      params: params
    };

    const body: any = Object.assign({}, lexEntry);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/'), body, httpOptions);
  }

  modifyAndAccepptLexEntry(language: Language, entryId: string, lemmaVersion: LemmaVersion) {
    const body: any = Object.assign({}, lemmaVersion);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/modify_and_accept_version'), body);
  }

  modifyLexEntry(language: Language, entryId: string, lemmaVersion: LemmaVersion) {
    const body: any = Object.assign({}, lemmaVersion);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/modify_version'), body);
  }

  reviewLaterLexEntry(language: Language, entryId: string) {
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/review_later_version'), null);
  }

  dropEntry(language: Language, entryId: string) {
    return this.httpClient.delete<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId));
  }

  acceptVersion(language: Language, entryId: string, lemmaVersion: LemmaVersion) {
    const body: any = Object.assign({}, lemmaVersion);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/accept_version'), body);
  }

  rejectVersion(language: Language, entryId: string, lemmaVersion: LemmaVersion) {
    const body: any = Object.assign({}, lemmaVersion);
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/reject_version'), body);
  }

  dropOutdatedHistory(language: Language, entryId: string) {
    return this.httpClient.post<LexEntry>(this.generateUrl(language, 'lex_entries/' + entryId + '/drop_outdated_history'), null);
  }

  getChoiceFieldsSuggestions(language: Language) {
    return this.httpClient.get<any>(this.generateUrl(language, 'search_suggestions_choice'));
  }

  getSearchSuggestions(language: Language, field: string, searchTerm: string): Observable<any> {
    let params: HttpParams = new HttpParams();

    params = params.set('field', field);
    params = params.set('searchTerm', searchTerm);

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<any>(this.generateUrl(language, 'search_suggestions'), httpOptions);
  }

  getSortOrder(language: Language, lemma: string, dictionaryLanguage: DictionaryLanguage): Observable<LemmaVersion[]> {
    let params: HttpParams = new HttpParams();

    params = params.set('dictionaryLanguage', dictionaryLanguage);
    params = params.set('lemma', lemma);

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<any>(this.generateUrl(language, 'get_order'), httpOptions);
  }

  saveSortOrder(language: Language,  dictionaryLanguage: DictionaryLanguage, lemmas: LemmaVersion[]) {
    let params: HttpParams = new HttpParams();

    params = params.set('dictionaryLanguage', dictionaryLanguage);

    const body: any = Object.assign({}, { lemmas: lemmas });

    const httpOptions = {
      params: params
    };

    return this.httpClient.post<any>(this.generateUrl(language, 'update_order'), body, httpOptions);
  }

  exportFieldsByEditorQuery(language: Language, editorQuery: EditorQuery, fields: string[]): Observable<HttpResponse<Blob>> {
    let params: HttpParams = new HttpParams();

    params = this.editorQueryToHttpParam(editorQuery, params);
    const body: any = Object.assign({}, { fields: fields });

    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');

    return this.httpClient.post(this.generateUrl(language, 'lex_entries_export'), body, {
      params: params,
      headers: zipHeaders,
      responseType: 'blob',
      observe: 'response'
    });
  }

  exportFieldsBySearchCriteria(language: Language, searchCriteria: SearchCriteria, fields: string[]): Observable<HttpResponse<Blob>> {
    let params: HttpParams = new HttpParams();

    params = this.searchCriteriaToHttpParam(searchCriteria, params);
    const body: any = Object.assign({}, { fields: fields });

    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');

    return this.httpClient.post(this.generateUrl(language, 'search_export'), body, {
      params: params,
      headers: zipHeaders,
      responseType: 'blob',
      observe: 'response'
    });
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

  private searchCriteriaToHttpParam(searchCriteria: SearchCriteria|EditorSearchCriteria, params: HttpParams): HttpParams {
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

    const editorSearchCriteria = searchCriteria as EditorSearchCriteria;
    if (!!editorSearchCriteria.category && editorSearchCriteria.category != "") {
      params = params.set('category', editorSearchCriteria.category);
    }

    if (!!editorSearchCriteria.subSemantics && editorSearchCriteria.subSemantics != "") {
      params = params.set('subSemantics', editorSearchCriteria.subSemantics);
    }

    if (!!editorSearchCriteria.gender && editorSearchCriteria.gender != "") {
      params = params.set('gender', editorSearchCriteria.gender);
    }

    if (!!editorSearchCriteria.grammar && editorSearchCriteria.grammar != "") {
      params = params.set('grammar', editorSearchCriteria.grammar);
    }

    if (!!editorSearchCriteria.onlyAutomaticChanged && (editorSearchCriteria.onlyAutomaticChanged)) {
      params = params.set('onlyAutomaticChanged', editorSearchCriteria.onlyAutomaticChanged);
    }

    if (!!editorSearchCriteria.excludeAutomaticChanged && (editorSearchCriteria.excludeAutomaticChanged)) {
      params = params.set('excludeAutomaticChanged', editorSearchCriteria.excludeAutomaticChanged);
    }

    if (!!editorSearchCriteria.automaticChangesType && editorSearchCriteria.automaticChangesType != 'ALL') {
      params = params.set('automaticChangesType', editorSearchCriteria.automaticChangesType);
    }

    if (editorSearchCriteria.showReviewLater !== undefined) {
      params = params.set('showReviewLater', editorSearchCriteria.showReviewLater);
    }

    if (!!editorSearchCriteria.verification && (editorSearchCriteria.verification)) {
      params = params.set('verification', editorSearchCriteria.verification);
    }

    return params;
  }
}
