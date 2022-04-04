import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditorQuery } from '../models/editor-query';
import { LexEntry } from '../models/lex-entry';
import { Page } from '../models/page';
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

    return params;
  }
}
