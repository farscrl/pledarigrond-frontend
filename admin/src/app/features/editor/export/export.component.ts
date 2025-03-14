import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { EditorQuery } from 'src/app/models/editor-query';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUtils } from 'src/app/utils/file.utils';

export class ExportOption {
  label: string = "";
  value: string = "";
  checked: boolean = false;
}

export class ExportData {
  filter?: SearchCriteria | EditorQuery;
}

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
    standalone: false
})
export class ExportComponent implements OnInit {

  filter?: SearchCriteria | EditorQuery;

  allChecked = false;
  indeterminate = false;
  checkOptions: ExportOption[] = [];

  isExporting = false;

  constructor(
    private modal: NzModalRef,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private translateService: TranslateService,
    private fileUtils: FileUtils,
    @Inject(NZ_MODAL_DATA) data: ExportData
  ) {
    this.filter = data.filter;
  }

  ngOnInit(): void {
    this.checkOptions = [
      { label: this.translateService.instant('lexicon.lemma.columns.de'), value: 'deStichwort', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.de_grammar'), value: 'deGrammatik', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.de_gender'), value: 'deGenus', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.de_semantics'), value: 'deSubsemantik', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.de_link'), value: 'deRedirect', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.de_additional_search'), value: 'deTags', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm'), value: 'rmStichwort', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_grammar'), value: 'rmGrammatik', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_gender'), value: 'rmGenus', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_semantics'), value: 'rmSubsemantik', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_link'), value: 'rmRedirect', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_conjugation'), value: 'rmFlex', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_additional_search'), value: 'rmTags', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.category'), value: 'categories', checked: false },
      { label: this.translateService.instant('lexicon.lemma.columns.comment'), value: 'userComment', checked: false },
    ];
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
