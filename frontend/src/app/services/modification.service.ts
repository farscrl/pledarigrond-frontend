import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LemmaVersion } from '../models/lemma-version';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModificationService {

  constructor(private httpClient: HttpClient) { }

  create(language: string, version: LemmaVersion) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<LemmaVersion>(this.getModificationUrl(language), body);
  }

  suggestChange(language: string, id: string, version: LemmaVersion) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<LemmaVersion>(this.getModificationUrl(language, id), body);
  }

  spellcheckerSuggestion(language: string, version: LemmaVersion) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<LemmaVersion>(this.getModificationUrlSpellchecker(language), body);
  }

  private getModificationUrl(language: string, id?: string): string {
    const url = environment.apiUrl + "/" + language + "/user/modify";
    if (!id) {
      return url + '/new';
    }
    return url + '/modify/' + id;
  }

  private getModificationUrlSpellchecker(language: string): string {
    let base = environment.apiUrl;
    if (language === 'puter' || language === 'vallader') {
      base = 'https://admin-api.dicziunaris-ladins.ch';
    }
    return base + "/" + language + "/user/modify/new";
  }
}
