import { Component, OnInit } from '@angular/core';
import { BackupInfos, DbInfos } from 'src/app/models/db-infos';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-db-administration',
  templateUrl: './db-administration.component.html',
  styleUrls: ['./db-administration.component.scss']
})
export class DbAdministrationComponent implements OnInit {

  dbInfos: DbInfos = new DbInfos();
  isLoadingDbInfos = false;
  backupInfos: BackupInfos = new BackupInfos();

  constructor(private dbService: DbService) { }

  ngOnInit(): void {
    this.loadDbStats();
    this.dbService.getBackupInfos().subscribe(data => {
      this.backupInfos = data;
    },
    error => {
      console.error(error);
    });
  }

  loadDbStats() {
    this.isLoadingDbInfos = true;
    this.dbService.getDbInfos().subscribe(data => {
      this.dbInfos = data;
      this.isLoadingDbInfos = false;
    },
    error => {
      this.isLoadingDbInfos = false;
      console.error(error);
    });
  }

  downloadBackupFile() {
    console.log("implement me");
  }

}
