import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BackupInfos, DbInfos, IndexInfos } from '../models/db-infos';
import { Language } from '../models/security';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private httpClient = inject(HttpClient);

  private dbBasePath = '/admin/db/';

  getDbInfos(language: Language): Observable<DbInfos> {
    return this.httpClient.get<DbInfos>(this.generateUrl(language, 'db_stats'));
  }

  exportDb(language: Language): Observable<HttpResponse<Blob>> {
    return this.httpClient.post(this.generateUrl(language, 'export_db'), null, { responseType: 'blob', observe: 'response' });
  }

  importDb(language: Language, formData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl(language, 'import_db'), formData);
  }

  dropDb(language: Language): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl(language, 'drop_db'), null);
  }

  getBackupInfos(language: Language): Observable<BackupInfos> {
    return this.httpClient.get<BackupInfos>(this.generateUrl(language, 'backup_infos'));
  }

  downloadBackupFile(language: Language, fileName: string): Observable<HttpResponse<Blob>>  {
    let zipHeaders = new HttpHeaders();
    zipHeaders = zipHeaders.set('Accept', 'application/zip');
    return this.httpClient.get(this.generateUrl(language, 'download_backup/' + fileName), {
      headers: zipHeaders,
      responseType: 'blob',
      observe: 'response'
    });
  }

  getIndexInfos(language: Language): Observable<IndexInfos> {
    return this.httpClient.get<IndexInfos>(this.generateUrl(language, 'index_stats'));
  }

  rebuildIndex(language: Language): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl(language, 'rebuild_index'), null);
  }

  rebuildSuggestionsIndex(language: Language): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl(language, 'rebuild_suggestions_index'), null);
  }

  private generateUrl(language: Language, segment: string) {
    return environment.apiUrl + "/" + language + this.dbBasePath + segment;
  }
}
