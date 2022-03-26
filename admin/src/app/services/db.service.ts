import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackupInfos, DbInfos, IndexInfos } from '../models/db-infos';
import { Language } from '../models/security';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbBasePath = '/admin/db/';

  constructor(private httpClient: HttpClient) { }

  getDbInfos(language: Language): Observable<DbInfos> {
    return this.httpClient.get<DbInfos>(this.generateUrl(language, 'db_stats'));
  }

  exportDb(language: Language): Observable<Blob> {
    return this.httpClient.post(this.generateUrl(language, 'export_db'), null, { responseType: 'blob' });
  }

  reloadDemoData(language: Language): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl(language, 'import_db'), null);
  }

  getBackupInfos(language: Language): Observable<BackupInfos> {
    return this.httpClient.get<BackupInfos>(this.generateUrl(language, 'backup_infos'));
  }

  getIndexInfos(language: Language): Observable<IndexInfos> {
    return this.httpClient.get<IndexInfos>(this.generateUrl(language, 'index_stats'));
  }

  rebuildIndex(language: Language): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl(language, 'rebuild_index'), null);
  }

  private generateUrl(language: Language, segment: string) {
    return environment.apiUrl + "/" + language + this.dbBasePath + segment;
  }
}
