import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private httpClient = inject(HttpClient);


  getNbrEntries(language: string) {
    return this.httpClient.get<number>(this.getInfoUrl(language, 'entries'));
  }

  private getInfoUrl(language: string, segment: string): string {
    return environment.apiUrl + "/" + language + "/user/info/" + segment;
  }
}
