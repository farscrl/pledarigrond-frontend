import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { EditorQuery } from 'src/app/models/editor-query';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUtils } from 'src/app/utils/file.utils';
import { NzCheckboxOption } from 'ng-zorro-antd/checkbox';

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
  checkOptions: NzCheckboxOption[] = [];
  selectedFields: NzCheckboxOption['value'][] = []

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
      { label: this.translateService.instant('lexicon.lemma.columns.de'), value: 'deStichwort' },
      { label: this.translateService.instant('lexicon.lemma.columns.de_grammar'), value: 'deGrammatik' },
      { label: this.translateService.instant('lexicon.lemma.columns.de_gender'), value: 'deGenus' },
      { label: this.translateService.instant('lexicon.lemma.columns.de_semantics'), value: 'deSubsemantik' },
      { label: this.translateService.instant('lexicon.lemma.columns.de_link'), value: 'deRedirect' },
      { label: this.translateService.instant('lexicon.lemma.columns.de_additional_search'), value: 'deTags' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm'), value: 'rmStichwort' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_grammar'), value: 'rmGrammatik' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_gender'), value: 'rmGenus' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_semantics'), value: 'rmSubsemantik' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_link'), value: 'rmRedirect' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_conjugation'), value: 'rmFlex' },
      { label: this.translateService.instant('lexicon.lemma.columns.rm_additional_search'), value: 'rmTags' },
      { label: this.translateService.instant('lexicon.lemma.columns.category'), value: 'categories' },
      { label: this.translateService.instant('lexicon.lemma.columns.comment'), value: 'userComment' },
    ];
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.selectedFields = [];
      this.checkOptions.forEach(option => {
        this.selectedFields.push(option.value);
      })
    } else {
      this.selectedFields = [];
    }
  }

  updateSingleChecked(): void {
    if (this.selectedFields.length === 0) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.selectedFields.length === this.checkOptions.length) {
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

    if (this.filter instanceof SearchCriteria) {
      this.editorService.exportFieldsBySearchCriteria(this.languageSelectionService.getCurrentLanguage(), this.filter, this.selectedFields as string[]).subscribe(data => {
        const fileName = this.fileUtils.getFileNameFromContentDispositionHeader(data.headers, "pledarigrond_field_export_tsv.zip");
        this.fileUtils.downloadFile(data, fileName);
        this.isExporting = false;
        this.modal.triggerOk();
      }, error => {
        console.error(error);
      });
    }

    if (this.filter instanceof EditorQuery) {
      this.editorService.exportFieldsByEditorQuery(this.languageSelectionService.getCurrentLanguage(), this.filter, this.selectedFields as string[]).subscribe(data => {
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
