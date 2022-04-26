import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EditorQuery } from 'src/app/models/editor-query';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUtils } from 'src/app/utils/file.utils';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  @Input()
  filter?: SearchCriteria | EditorQuery;

  allChecked = false;
  indeterminate = false;
  checkOptions = [
    { label: 'German', value: 'DStichwort', checked: false },
    { label: 'Grammar (de)', value: 'DGrammatik', checked: false },
    { label: 'Genus (de)', value: 'DGenus', checked: false },
    { label: 'Semantic (de)', value: 'DSubsemantik', checked: false },
    { label: 'Category', value: 'categories', checked: false },
    { label: 'Link (de)', value: 'DRedirect', checked: false },
    { label: 'Romansh', value: 'RStichwort', checked: false },
    { label: 'Grammar (rm)', value: 'RGrammatik', checked: false },
    { label: 'Genus (rm)', value: 'RGenus', checked: false },
    { label: 'Semantic (rm)', value: 'RSubsemantik', checked: false },
    { label: 'Link (rm)', value: 'RRedirect', checked: false },
    { label: 'Conjugation', value: 'RFlex', checked: false },
    { label: 'Additional search terms', value: 'RTags', checked: false },
    { label: 'Comment', value: 'user_comment', checked: false },
  ];

  isExporting = false;

  constructor(
    private modal: NzModalRef,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private translateService: TranslateService,
    private fileUtils: FileUtils,
  ) {

  }

  ngOnInit(): void {

  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptions = this.checkOptions.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptions = this.checkOptions.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptions.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptions.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  cancel() {
    this.modal.close();
  }

  export() {
    this.isExporting = true;
    const items = this.checkOptions.filter(item => item.checked === true);
    const fields: string[] = [];
    items.forEach(item => fields.push(item.value));

    if (this.filter instanceof SearchCriteria) {
      this.editorService.exportFieldsBySearchCriteria(this.languageSelectionService.getCurrentLanguage(), this.filter, fields).subscribe(data => {
        const fileName = this.fileUtils.getFileNameFromContentDispositionHeader(data.headers, "pledarigrond_field_export_tsv.zip");
        this.fileUtils.downloadFile(data, fileName);
        this.isExporting = false;
        this.modal.triggerOk();
      }, error => {
        console.error(error);
      });
    }

    if (this.filter instanceof EditorQuery) {
      this.editorService.exportFieldsByEditorQuery(this.languageSelectionService.getCurrentLanguage(), this.filter, fields).subscribe(data => {
        const fileName = this.fileUtils.getFileNameFromContentDispositionHeader(data.headers, "pledarigrond_field_export_tsv.zip");
        this.fileUtils.downloadFile(data, fileName);
        this.isExporting = false;
        this.modal.triggerOk();
      }, error => {
        console.error(error);
      });
    }
  }
}
