import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from './../../environments/environment';
import { EntryVersionDto } from '../models/dictionary';

@Injectable({
  providedIn: 'root'
})
export class ModificationService {
  private httpClient = inject(HttpClient);


  create(language: string, version: EntryVersionDto) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryVersionDto>(this.getModificationUrl(language), body);
  }

  suggestChange(language: string, id: string, version: EntryVersionDto) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryVersionDto>(this.getModificationUrl(language, id), body);
  }

  spellcheckerSuggestion(language: string, version: EntryVersionDto) {
    const body: any = Object.assign({}, version);
    return this.httpClient.post<EntryVersionDto>(this.getModificationUrlSpellchecker(language), body);
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
