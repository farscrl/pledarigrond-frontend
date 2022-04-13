import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private httpClient: HttpClient) { }

  getJsonZip(language: string): Observable<Blob> {
    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');
    const httpOptions = {
      headers: zipHeaders,
      responseType: 'blob' as 'json',
    };
    return this.httpClient.get<Blob>(this.getExportUrl(language, 'json'), httpOptions);
  }

  private getExportUrl(language: string, segment: string): string {
    return environment.apiUrl + "/" + language + "/user/export/" + segment;
  }
}
