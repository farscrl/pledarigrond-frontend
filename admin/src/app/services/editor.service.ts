import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryLanguage } from '../models/dictionary-language';
import { EditorQuery } from '../models/editor-query';
import { Page } from '../models/page';
import { EditorSearchCriteria, SearchCriteria } from '../models/search-criteria';
import { Language } from '../models/security';
import { environment } from '../../environments/environment';
import { ReferenceVerbDto } from '../models/reference-verb-dto';
import {
  EntryDto,
  EntryVersionDto,
  EntryVersionExtendedDto,
  EntryVersionInternalDto,
  NormalizedEntryVersionDto
} from '../models/dictionary';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private editorBasePath = '/editor/';

  constructor(private httpClient: HttpClient) { }

  getAllEntries(language: Language, editorQuery: EditorQuery, page: number): Observable<Page<NormalizedEntryVersionDto>> {
    let params: HttpParams = new HttpParams();

    params = this.editorQueryToHttpParam(editorQuery, params);

    if (page !== 0) {
      params = params.set('page', page);
    }

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<Page<NormalizedEntryVersionDto>>(this.generateUrl(language, 'entries'), httpOptions);
  }

  searchLemmaVersions(language: Language, searchCriteria: SearchCriteria, page: number, pageSize = 15): Observable<Page<EntryVersionExtendedDto>> {
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

    return this.httpClient.get<Page<EntryVersionExtendedDto>>(this.generateUrl(language, 'search'), httpOptions);
  }

  getEntry(language: Language, id: string): Observable<EntryDto> {
    return this.httpClient.get<EntryDto>(this.generateUrl(language, 'entries/' + id));
  }

  newEntry(language: Language, version: EntryVersionDto, asSuggestion: boolean) {
    let params: HttpParams = new HttpParams();

    if (asSuggestion) {
      params = params.set('asSuggestion', true);
    }

    const httpOptions = {
      params: params
    };

    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries'), body, httpOptions);
  }

  modifyAndAcceptEntryVersion(language: Language, entryId: string, version: EntryVersionDto) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries/' + entryId + '/add_version'), body);
  }

  modifyEntryVersion(language: Language, entryId: string, version: EntryVersionDto): Observable<EntryDto> {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries/' + entryId + '/suggest_version'), body);
  }

  reviewEntryLater(language: Language, entryId: string, version: EntryVersionInternalDto) {
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries/' + entryId + '/review_later_version/' + version.versionId), null);
  }

  dropEntry(language: Language, entryId: string) {
    return this.httpClient.delete<EntryDto>(this.generateUrl(language, 'entries/' + entryId));
  }

  acceptVersion(language: Language, entryId: string, version: EntryVersionInternalDto) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries/' + entryId + '/accept_version/' + version.versionId), body);
  }

  rejectVersion(language: Language, entryId: string, version: EntryVersionInternalDto) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries/' + entryId + '/reject_version/' + version.versionId), body);
  }

  dropOutdatedHistory(language: Language, entryId: string) {
    return this.httpClient.post<EntryDto>(this.generateUrl(language, 'entries/' + entryId + '/drop_outdated_history'), null);
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

  getReferenceInflection(language: Language, searchTerm: string): Observable<ReferenceVerbDto> {
    let params: HttpParams = new HttpParams();

    params = params.set('searchTerm', searchTerm);

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<any>(this.generateUrl(language, 'reference_inflection'), httpOptions);
  }

  getSortOrder(language: Language, lemma: string, dictionaryLanguage: DictionaryLanguage): Observable<EntryVersionInternalDto[]> {
    let params: HttpParams = new HttpParams();

    params = params.set('dictionaryLanguage', dictionaryLanguage);
    params = params.set('lemma', lemma);

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<EntryVersionInternalDto[]>(this.generateUrl(language, 'get_order'), httpOptions);
  }

  saveSortOrder(language: Language,  dictionaryLanguage: DictionaryLanguage, lemmas: EntryVersionInternalDto[]) {
    let params: HttpParams = new HttpParams();

    params = params.set('dictionaryLanguage', dictionaryLanguage);

    const body: any = Object.assign({}, { lemmas: lemmas });

    const httpOptions = {
      params: params
    };

    return this.httpClient.post<EntryVersionInternalDto[]>(this.generateUrl(language, 'update_order'), body, httpOptions);
  }

  exportFieldsByEditorQuery(language: Language, editorQuery: EditorQuery, fields: string[]): Observable<HttpResponse<Blob>> {
    let params: HttpParams = new HttpParams();

    params = this.editorQueryToHttpParam(editorQuery, params);
    const body: any = Object.assign({}, { fields: fields });

    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');

    return this.httpClient.post(this.generateUrl(language, 'entries_export'), body, {
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
    if (!editorQuery) {
      return params;
    }

    if (!!editorQuery.state) {
      params = params.set('state', editorQuery.state);
    }

    if (!!editorQuery.startTime) {
      params = params.set('startTime', editorQuery.startTime);
    }

    if (!!editorQuery.endTime) {
      params = params.set('endTime', editorQuery.endTime);
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
