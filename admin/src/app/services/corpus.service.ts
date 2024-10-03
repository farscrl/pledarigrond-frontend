import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Language } from '../models/security';

@Injectable({
  providedIn: 'root'
})
export class CorpusService {

  private namesBasePath = '/admin/corpus';

  constructor(private httpClient: HttpClient) { }

  find(language: Language, s: string): Observable<string[]> {
    let params: HttpParams = new HttpParams();
    params = params.set('s', s);

    const httpOptions = {
      params: params
    };

    return this.httpClient.get<string[]>(this.getCorpusUrl(language) + '/find', httpOptions);
  }

  private getCorpusUrl(language: Language, ) {
    return environment.apiUrl + '/' + language.toString() + this.namesBasePath;
  }}
