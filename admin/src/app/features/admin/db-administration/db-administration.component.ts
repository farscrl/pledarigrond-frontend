import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BackupInfos, DbInfos } from 'src/app/models/db-infos';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { ExportDumpComponent } from './export-dump/export-dump.component';
import { ImportDumpComponent } from './import-dump/import-dump.component';
import { TranslateService } from '@ngx-translate/core';
import { FileUtils } from 'src/app/utils/file.utils';

@Component({
    selector: 'app-db-administration',
    templateUrl: './db-administration.component.html',
    styleUrls: ['./db-administration.component.scss'],
    standalone: false
})
export class DbAdministrationComponent implements OnInit {

  dbInfos: DbInfos = new DbInfos();
  isLoadingDbInfos = false;
  isReloadingDemoData = false;
  backupInfos: BackupInfos = new BackupInfos();

  constructor(
    private dbService: DbService,
    private languageSelectionService: LanguageSelectionService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService,
    private fileUtils: FileUtils,
  ) { }

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
      this.fileUtils.downloadFile(data, fileName);
    }, error => {
      console.error(error);
    });
  }

  importDb() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('database.dump.title'),
      nzContent: ImportDumpComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzViewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.subscribe(() => {
      this.loadDbStats();
    });
  }


  exportDb() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('database.dump.title'),
      nzContent: ExportDumpComponent,
      nzClosable: false,
      nzViewContainerRef: this.viewContainerRef,
    });
  }

  dropDb() {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('database.drop.title'),
      nzContent: '<b style="color: red;">' + this.languageSelectionService.getCurrentLanguage() + '</b>',
      nzOkText: this.translateService.instant('database.drop.yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.dropDbConfirmed(),
      nzCancelText: this.translateService.instant('database.drop.no'),
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
