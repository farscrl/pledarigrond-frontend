import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Language } from '../models/security';

@Injectable({
  providedIn: 'root'
})
export class CorpusService {
  private httpClient = inject(HttpClient);


  private namesBasePath = '/admin/corpus';

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
