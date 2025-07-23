import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InflectionType } from '../models/inflection';
import { Language } from '../models/security';
import { environment } from './../../environments/environment';
import { Inflection } from '../models/dictionary';

@Injectable({
  providedIn: 'root'
})
export class InflectionService {
  private editorBasePath = '/editor/inflection/';

  constructor(private httpClient: HttpClient) { }

  getInflectionSubtypes(language: Language, type: InflectionType) {
    return this.httpClient.get<any>(this.generateUrl(language, type, 'subtypes'));
  }

  guessInflectionForms(language: Language, type: InflectionType, baseForm: string, genus?: string, flex?: string): Observable<Inflection> {
    let params: HttpParams = new HttpParams();

    if (genus) {
      params = params.set('genus', genus);
    }

    if (flex) {
      params = params.set('flex', flex);
    }

    const httpOptions = {
      params: params
    };
    return this.httpClient.get<any>(this.generateUrl(language, type, "subtypes" + '/' + baseForm), httpOptions);
  }

  getInflectionForms(language: Language, type: InflectionType, subType: string, baseForm: string): Observable<Inflection> {
    if (baseForm) {
      baseForm = encodeURIComponent(baseForm);
    }
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
