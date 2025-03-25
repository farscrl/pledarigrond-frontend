import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
    selector: 'app-import-dump',
    templateUrl: './import-dump.component.html',
    styleUrls: ['./import-dump.component.scss'],
    standalone: false
})
export class ImportDumpComponent implements OnInit {

  uploading = false;

  fileToUpload?: NzUploadFile;

  constructor(private modal: NzModalRef, private dbService: DbService, private languageSelectionService: LanguageSelectionService) { }

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
