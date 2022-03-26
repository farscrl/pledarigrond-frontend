import { Component, OnInit } from '@angular/core';
import { BackupInfos, DbInfos } from 'src/app/models/db-infos';
import { Language } from 'src/app/models/security';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-db-administration',
  templateUrl: './db-administration.component.html',
  styleUrls: ['./db-administration.component.scss']
})
export class DbAdministrationComponent implements OnInit {

  dbInfos: DbInfos = new DbInfos();
  isLoadingDbInfos = false;
  isDownloadingDb = false;
  isReloadingDemoData = false;
  backupInfos: BackupInfos = new BackupInfos();

  constructor(private dbService: DbService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.loadDbStats();
    this.dbService.getBackupInfos(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.backupInfos = data;
    },
    error => {
      console.error(error);
    });
  }

  loadDbStats() {
    this.isLoadingDbInfos = true;
    this.dbService.getDbInfos(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
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

  exportDb() {
    this.isDownloadingDb = true;
    this.dbService.exportDb(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.isDownloadingDb = false;
      console.log(data);
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(data)
      a.href = objectUrl
      a.download = 'pledarigrond-export.zip';
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, error => {
      console.error(error);
      this.isDownloadingDb = false;
    })
  }

  reloadDemoData() {
    // TODO: implement modal to ask.
    return;

    this.isReloadingDemoData = true;
    this.dbService.reloadDemoData(this.languageSelectionService.getCurrentLanguage()).subscribe(() => {
      this.isReloadingDemoData = false;
    },
    error => {
      this.isReloadingDemoData = false;
      console.error(error);
    });
  }
}
