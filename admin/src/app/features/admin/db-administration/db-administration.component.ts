import { Component, OnInit } from '@angular/core';
import { BackupInfos } from 'src/app/models/db-infos';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-db-administration',
  templateUrl: './db-administration.component.html',
  styleUrls: ['./db-administration.component.scss']
})
export class DbAdministrationComponent implements OnInit {

  backupInfos: BackupInfos = new BackupInfos();

  constructor(private dbService: DbService) { }

  ngOnInit(): void {
    this.dbService.getBackupInfos().subscribe(data => {
      this.backupInfos = data;
    },
    error => {
      console.error(error)
    });
  }

  downloadBackupFile() {
    console.log("implement me");
  }

}
