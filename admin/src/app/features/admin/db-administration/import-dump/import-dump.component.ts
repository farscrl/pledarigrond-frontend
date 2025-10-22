import { Component, OnInit, inject } from '@angular/core';
import { NzModalRef, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzUploadFile, NzUploadComponent } from 'ng-zorro-antd/upload';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-import-dump',
    templateUrl: './import-dump.component.html',
    styleUrls: ['./import-dump.component.scss'],
    imports: [NzUploadComponent, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, NzIconDirective, NzModalFooterDirective, TranslatePipe]
})
export class ImportDumpComponent implements OnInit {
  private modal = inject(NzModalRef);
  private dbService = inject(DbService);
  private languageSelectionService = inject(LanguageSelectionService);


  uploading = false;

  fileToUpload?: NzUploadFile;

  ngOnInit(): void {
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileToUpload = file;
    return false;
  };

  get fileList(): NzUploadFile[] {
    if (!this.fileToUpload) {
      return [];
    }
    return [this.fileToUpload];
  }

  set fileList(files: NzUploadFile[]) {
    if (files.length === 0) {
      this.fileToUpload = undefined;
    }
  }

  handleUpload(): void {
    if (!this.fileToUpload) {
      return;
    }
    const formData = new FormData();
    formData.append('file', this.fileToUpload as any);

    this.uploading = true;


    this.dbService.importDb(this.languageSelectionService.getCurrentLanguage(), formData).subscribe(() => {
      this.uploading = false;
      this.fileToUpload = undefined;
      this.modal.close();
    }, error => {
      console.error(error);
      this.uploading = false;
    });
  }

  cancel() {
    this.modal.close();
  }
}
