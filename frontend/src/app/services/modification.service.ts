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

  private getModificationUrl(language: string, id?: string): string {
    const url = environment.apiUrl + "/" + language + "/user/modify";
    if (!id) {
      return url + '/new';
    }
    return url + '/modify/' + id;
  }
}
