import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackupInfos, IndexInfos } from '../models/db-infos';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbBasePath = '/admin/db/';

  constructor(private httpClient: HttpClient) { }

  getBackupInfos(): Observable<BackupInfos> {
    return this.httpClient.get<BackupInfos>(this.generateUrl('backup_infos'));
  }

  getIndexInfos(): Observable<IndexInfos> {
    return this.httpClient.get<IndexInfos>(this.generateUrl('index_stats'));
  }

  rebuildIndex(): Observable<void> {
    return this.httpClient.post<void>(this.generateUrl('rebuild_index'), null);
  }

  private generateUrl(segment: string) {
    return environment.apiUrl + this.dbBasePath + segment;
  }
}
