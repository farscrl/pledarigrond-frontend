import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { DictionaryLanguage } from 'src/app/models/dictionary-language';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { EntryVersionInternalDto } from '../../models/dictionary';

export class ChanceSortOrderData {
  entryVersion?: EntryVersionInternalDto;
  dictionaryLanguage?: DictionaryLanguage;
}

@Component({
    selector: 'app-change-sort-order',
    templateUrl: './change-sort-order.component.html',
    styleUrls: ['./change-sort-order.component.scss'],
    standalone: false
})
export class ChangeSortOrderComponent implements OnInit {

  entryVersion?: EntryVersionInternalDto;
  dictionaryLanguage?: DictionaryLanguage;

  listStyle = {
    width: '100%',
  };

  searchString: string = "";
  itemsToReorder: EntryVersionInternalDto[] = [];
  sortedItems: EntryVersionInternalDto[] = [];

  isSaving = false;

  constructor(
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) data: ChanceSortOrderData
  ) {
    this.entryVersion = data.entryVersion;
    this.dictionaryLanguage = data.dictionaryLanguage;
  }

  ngOnInit(): void {
    if (!this.entryVersion || !this.dictionaryLanguage) {
      return;
    }

    if (this.dictionaryLanguage === 'GERMAN') {
      this.searchString = this.entryVersion.deStichwort!;
    } else {
      this.searchString = this.entryVersion.rmStichwort!;
    }

    this.editorService.getSortOrder(this.languageSelectionService.getCurrentLanguage(), this.searchString, this.dictionaryLanguage).subscribe(data => {
      this.itemsToReorder = data;
    }, error => {
      console.error(error);
    });
  }

  listSorted(items: EntryVersionInternalDto[]) {
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
