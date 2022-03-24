import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackupInfos } from '../models/backup-infos';
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

  private generateUrl(segment: string) {
    return environment.apiUrl + this.dbBasePath + segment;
  }
}
