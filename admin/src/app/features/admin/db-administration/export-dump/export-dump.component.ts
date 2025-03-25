import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { FileUtils } from 'src/app/utils/file.utils';

@Component({
    selector: 'app-export-dump',
    templateUrl: './export-dump.component.html',
    styleUrls: ['./export-dump.component.scss'],
    standalone: false
})
export class ExportDumpComponent implements OnInit {

  isDownloadingDb = false;

  includeVersionHistory = true;
  anonymizeData = false;

  constructor(
    private modal: NzModalRef,
    private dbService: DbService,
    private languageSelectionService: LanguageSelectionService,
    private fileUtils: FileUtils,
  ) { }

  ngOnInit(): void {
  }

  export() {
    this.isDownloadingDb = true;
    this.dbService.exportDb(this.languageSelectionService.getCurrentLanguage(), this.includeVersionHistory, this.anonymizeData).subscribe(data => {
      this.isDownloadingDb = false;
      const fileName = this.fileUtils.getFileNameFromContentDispositionHeader(data.headers, 'pledarigrond-export.zip');
      this.fileUtils.downloadFile(data, fileName);
      this.modal.close();
    }, error => {
      console.error(error);
      this.isDownloadingDb = false;
    })
  }

  cancel() {
    this.modal.close();
  }
}
