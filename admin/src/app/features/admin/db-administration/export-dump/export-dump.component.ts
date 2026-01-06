import { Component, inject, OnInit } from '@angular/core';
import { NzModalFooterDirective, NzModalRef } from 'ng-zorro-antd/modal';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { FileUtils } from 'src/app/utils/file.utils';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-export-dump',
    templateUrl: './export-dump.component.html',
    styleUrls: ['./export-dump.component.scss'],
    imports: [NzModalFooterDirective, NzButtonComponent, NzWaveDirective, TranslatePipe]
})
export class ExportDumpComponent implements OnInit {
  private modal = inject(NzModalRef);
  private dbService = inject(DbService);
  private languageSelectionService = inject(LanguageSelectionService);
  private fileUtils = inject(FileUtils);


  isDownloadingDb = false;

  ngOnInit(): void {
  }

  export() {
    this.isDownloadingDb = true;
    this.dbService.exportDb(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
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
