import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { DictionaryLanguage } from 'src/app/models/dictionary-language';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntry } from 'src/app/models/lex-entry';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

export class ChanceSortOrderData {
  lexEntry?: LexEntry;
  dictionaryLanguage?: DictionaryLanguage;
}

@Component({
    selector: 'app-change-sort-order',
    templateUrl: './change-sort-order.component.html',
    styleUrls: ['./change-sort-order.component.scss'],
    standalone: false
})
export class ChangeSortOrderComponent implements OnInit {

  lexEntry?: LexEntry;
  dictionaryLanguage?: DictionaryLanguage;

  listStyle = {
    width: '100%',
  };

  searchString: string = "";
  itemsToReorder: LemmaVersion[] = [];
  sortedItems = [];

  isSaving = false;

  constructor(
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) data: ChanceSortOrderData
  ) {
    this.lexEntry = data.lexEntry;
    this.dictionaryLanguage = data.dictionaryLanguage;
  }

  ngOnInit(): void {
    if (!this.lexEntry || !this.dictionaryLanguage) {
      return;
    }

    if (this.dictionaryLanguage === 'GERMAN') {
      this.searchString = this.lexEntry.current.lemmaValues.DStichwort!;
    } else {
      this.searchString = this.lexEntry.current.lemmaValues.RStichwort!;
    }

    this.editorService.getSortOrder(this.languageSelectionService.getCurrentLanguage(), this.searchString, this.dictionaryLanguage).subscribe(data => {
      this.itemsToReorder = data;
    }, error => {
      console.error(error);
    });
  }

  listSorted(items: any) {
    this.sortedItems = items;
  }

  save() {
    this.isSaving = true;
    this.editorService.saveSortOrder(this.languageSelectionService.getCurrentLanguage(), this.dictionaryLanguage!, this.sortedItems).subscribe(data => {
      // TODO: success notification
      this.isSaving = false;
      this.itemsToReorder = data;
      this.modal.close();
    }, error => {
      console.error(error);
      this.isSaving = false;
    });
  }

  cancel() {
    this.modal.close();
  }
}
