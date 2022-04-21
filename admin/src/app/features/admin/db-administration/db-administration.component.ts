import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BackupInfos, DbInfos } from 'src/app/models/db-infos';
import { Language } from 'src/app/models/security';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { ExportDumpComponent } from './export-dump/export-dump.component';
import { ImportDumpComponent } from './import-dump/import-dump.component';

@Component({
  selector: 'app-db-administration',
  templateUrl: './db-administration.component.html',
  styleUrls: ['./db-administration.component.scss']
})
export class DbAdministrationComponent implements OnInit {

  dbInfos: DbInfos = new DbInfos();
  isLoadingDbInfos = false;
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

  downloadBackupFile(fileName: string) {
    this.dbService.downloadBackupFile(this.languageSelectionService.getCurrentLanguage(), fileName).subscribe(data => {
      this.downloadFile(data, fileName, "application/zip");
    }, error => {
      console.error(error);
    });
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
    const modal = this.modalService.create({
      nzTitle: 'Download data...',
      nzContent: ExportDumpComponent,
      nzClosable: false,
      nzViewContainerRef: this.viewContainerRef,
    });
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

  private downloadFile(data: any, fileName: string, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', fileName);
    a.setAttribute('style', 'display: none');
    document.getElementsByTagName('body')[0].appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
