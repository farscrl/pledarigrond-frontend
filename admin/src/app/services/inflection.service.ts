import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InflectionType } from '../models/inflection';
import { Language } from '../models/security';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InflectionService {
  private editorBasePath = '/editor/inflection/';

  constructor(private httpClient: HttpClient) { }

  getInflectionSubtypes(language: Language, type: InflectionType) {
    return this.httpClient.get<any>(this.generateUrl(language, type, 'subtypes'));
  }

  getInflectionForms(language: Language, type: InflectionType, subType: string, baseForm: string) {
    return this.httpClient.get<any>(this.generateUrl(language, type, subType + '/' + baseForm));
  }

  private generateUrl(language: Language, type?: InflectionType, segment?: string) {
    let url = environment.apiUrl + "/" + language + this.editorBasePath;
    if (!type) {
      return url + segment;
    }
    return url + type + '/' + segment;
  }
}
