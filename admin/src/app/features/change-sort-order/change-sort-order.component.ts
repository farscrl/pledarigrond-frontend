import { Component, OnInit, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalTitleDirective, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { DictionaryLanguage } from 'src/app/models/dictionary-language';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { EntryVersionInternalDto } from '../../models/dictionary';
import { NotificationService } from '../../services/notification.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { NgxSortableModule } from 'ngx-sortable';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';

export class ChanceSortOrderData {
  entryVersion?: EntryVersionInternalDto;
  dictionaryLanguage?: DictionaryLanguage;
}

@Component({
    selector: 'app-change-sort-order',
    templateUrl: './change-sort-order.component.html',
    styleUrls: ['./change-sort-order.component.scss'],
    imports: [NzModalTitleDirective, NgxSortableModule, NzModalFooterDirective, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, TranslatePipe]
})
export class ChangeSortOrderComponent implements OnInit {
  private editorService = inject(EditorService);
  private languageSelectionService = inject(LanguageSelectionService);
  private modal = inject(NzModalRef);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);


  entryVersion?: EntryVersionInternalDto;
  dictionaryLanguage?: DictionaryLanguage;

  listStyle = {
    width: '100%',
  };

  searchString: string = "";
  itemsToReorder: EntryVersionInternalDto[] = [];
  sortedItems: EntryVersionInternalDto[] = [];

  isSaving = false;

  constructor() {
    const data = inject<ChanceSortOrderData>(NZ_MODAL_DATA);

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
      this.notificationService.success(
        this.translateService.instant('sort_order.success'),
        '',
        5000
      )
      this.isSaving = false;
      this.itemsToReorder = data;
      this.modal.close();
    }, error => {
      console.error(error);
      this.isSaving = false;
      this.notificationService.error(
        this.translateService.instant('sort_order.error'),
        '',
        15000
      )
    });
  }

  cancel() {
    this.modal.close();
  }
}
