import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getAllLexEntries(language: Language): Observable<Page<LexEntry>> {
    return this.httpClient.get<Page<LexEntry>>(this.generateUrl(language, 'lex_entries'));
  }

  private generateUrl(language: Language, segment: string) {
    return environment.apiUrl + "/" + language + this.editorBasePath + segment;
  }
}
