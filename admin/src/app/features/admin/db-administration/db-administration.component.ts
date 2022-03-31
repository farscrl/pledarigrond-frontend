import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BackupInfos, DbInfos } from 'src/app/models/db-infos';
import { Language } from 'src/app/models/security';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { ImportDumpComponent } from './import-dump/import-dump.component';

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

  constructor(private dbService: DbService, private languageSelectionService: LanguageSelectionService, private modalService: NzModalService, private viewContainerRef: ViewContainerRef) { }

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

  importDb() {
    const modal = this.modalService.create({
      nzTitle: 'Import DB dump',
      nzContent: ImportDumpComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {},
    });

    modal.afterClose.subscribe(() => {
      this.loadDbStats();
    });
  }

  exportDb() {
    this.isDownloadingDb = true;
    this.dbService.exportDb(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.isDownloadingDb = false;
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
    this.modalService.confirm({
      nzTitle: 'Do you really want to load demo-data into the database?',
      nzContent: '<b style="color: red;">' + this.languageSelectionService.getCurrentLanguage() + '</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.reloadDemoDataConfirmed(),
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  reloadDemoDataConfirmed() {
    this.isReloadingDemoData = true;
    this.dbService.reloadDemoData(this.languageSelectionService.getCurrentLanguage()).subscribe(() => {
      this.isReloadingDemoData = false;
    },
    error => {
      this.isReloadingDemoData = false;
      console.error(error);
    });
  }

  dropDb() {
    this.modalService.confirm({
      nzTitle: 'Do you really want to drop the database?',
      nzContent: '<b style="color: red;">' + this.languageSelectionService.getCurrentLanguage() + '</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.dropDbConfirmed(),
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  dropDbConfirmed() {
    this.dbService.dropDb(this.languageSelectionService.getCurrentLanguage()).subscribe(() => {
      // TODO: notification
    }, error => {
      console.error(error);
    });
  }
}
