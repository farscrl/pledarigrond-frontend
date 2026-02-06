import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private httpClient = inject(HttpClient);


  getJsonZip(language: string): Observable<Blob> {
    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');
    const httpOptions = {
      headers: zipHeaders,
      responseType: 'blob' as 'json',
    };
    return this.httpClient.get<Blob>(this.getExportUrl(language, 'json'), httpOptions);
  }

  requestPronunciationDownloadLink(language: string, email: string, acceptedTerms: boolean): Observable<void> {
    const body = {
      email,
      acceptedTerms
    };
    return this.httpClient.post<void>(this.getExportUrl(language, 'pronunciation/request-link'), body);
  }

  private getExportUrl(language: string, segment: string): string {
    return environment.apiUrl + "/" + language + "/user/export/" + segment;
  }
}
