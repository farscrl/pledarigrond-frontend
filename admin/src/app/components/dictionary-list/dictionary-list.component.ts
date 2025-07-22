import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExportComponent } from 'src/app/features/editor/export/export.component';

import moment from 'moment';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { LemmaListColumn } from 'src/app/models/lemma-list-column';
import { MainEntryComponent } from 'src/app/features/modify-entry/main-entry/main-entry.component';
import { forkJoin, Observable } from 'rxjs';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { EditorQuery } from 'src/app/models/editor-query';
import { DictionaryLanguage } from 'src/app/models/dictionary-language';
import { ChangeSortOrderComponent } from 'src/app/features/change-sort-order/change-sort-order.component';
import { TranslateService } from '@ngx-translate/core';
import { DiffModalComponent } from "../../features/diff-modal/diff-modal.component";
import { EntryVersionDto, EntryVersionInternalDto } from '../../models/dictionary';
import { DictionaryListItem, PaginationInfo } from '../../models/dictionary-list';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.scss'],
  standalone: false
})
export class DictionaryListComponent {

  @Input()
  columns: LemmaListColumn = new LemmaListColumn();

  @Input()
  filter?: SearchCriteria | EditorQuery;

  @Input()
  items!: DictionaryListItem[];

  @Input()
  paginationInfo!: PaginationInfo;

  @Input()
  showRejectButton = false;

  @Output()
  updatePage = new EventEmitter<number>();

  @Output()
  showDetailsForEntryId = new EventEmitter<string>();

  @Output()
  addUserFilter = new EventEmitter<string>();

  @Output()
  addVerifierFilter = new EventEmitter<string>();

  // used to pass math functions to template
  math = Math;


  checked = false;
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  constructor(
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private translateService: TranslateService,
  ) { }

  exportResults() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma.export.button'),
      nzContent: ExportComponent,
      nzClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        filter: this.filter,
      },
    });
  }

  changePage(pageNumber: number) {
    this.updatePage.emit(pageNumber - 1);
  }

  selectRow(item: DictionaryListItem) {
    const isSelected = item.selected;
    this.items.forEach(e => {
      e.selected = false;
    });
    item.selected = !isSelected;

    if (item.selected) {
      this.showDetailsForEntryId.emit(item.entryId);
    } else {
      this.showDetailsForEntryId.emit(undefined);
    }
  }

  filterUser(user?: string) {
    this.addUserFilter.emit(user);
  }

  filterVerifier(verifier?: string) {
    this.addVerifierFilter.emit(verifier);
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.items.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ entryId }) => this.setOfCheckedId.has(entryId!));
    this.indeterminate = listOfEnabledData.some(({ entryId }) => this.setOfCheckedId.has(entryId!)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.items
      .filter(({ disabled }) => !disabled)
      .forEach(({ entryId }) => this.updateCheckedSet(entryId!, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(entryId: string, checked: boolean): void {
    this.updateCheckedSet(entryId, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(entryId: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(entryId);
    } else {
      this.setOfCheckedId.delete(entryId);
    }
  }

  formateDate(timestamp: Date): string {
    return moment(timestamp).format("DD-MM-YYYY");
  }

  formateTime(timestamp: Date): string {
    return moment(timestamp).format("HH:mm:ss")
  }

  addEntry() {
    this.openLemmaModal();
  }

  editEntry(version: EntryVersionInternalDto) {
    // TODO: implement
    // this.openLemmaModal(entryId);
  }

  dropEntry(item: DictionaryListItem) {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma.delete.title'),
      nzContent: '<b style="color: red;">' +  item.version.deStichwort + ' / ' + item.version.rmStichwort + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzCancelText: this.translateService.instant('lexicon.lemma.delete.cancel'),
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.dropEntryVersionConfirmed(item.entryId),
      nzOnCancel: () => {}
    });
  }

  rejectEntryVersion(item: DictionaryListItem) {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma.reject.title'),
      nzContent: '<b style="color: red;">' +  item.version.deStichwort + ' / ' + item.version.rmStichwort + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzCancelText: this.translateService.instant('lexicon.lemma.reject.cancel'),
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.rejectEntryVersionConfirmed(item),
      nzOnCancel: () => {}
    });
  }

  rejectSelected() {
    const count = this.setOfCheckedId.size;

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma.multiedit.title'),
      nzContent: '<b style="color: red;">' + this.translateService.instant('lexicon.lemma.multiedit.content', {count}) + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.rejectSelectedItemsConfirmed(),
      nzOnCancel: () => {}
    });
  }

  rejectSelectedItemsConfirmed() {
    const subscriptions: Observable<any>[] = [];
    this.setOfCheckedId.forEach(id => {
      const items = this.items.filter(entry => entry.entryId === id);
      if (items && items.length === 1) {
        const item = items[0];

        // only applicable to unverified items
        if (item.version.versionStatus === 'Unverified') {
          subscriptions.push(this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), item.entryId, item.version));
        }
        this.onItemChecked(id, false);
      }
    });

    forkJoin(subscriptions).subscribe(() => {
      this.reloadCurrentPage();
    });
  }

  startReorder(item: DictionaryListItem, dictionaryLanguage: DictionaryLanguage) {
    const modal = this.modalService.create({
      nzContent: ChangeSortOrderComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 500,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        entryVersion: item.version,
        dictionaryLanguage: dictionaryLanguage,
      },
      nzOnOk: () => this.reloadCurrentPage()
    });
  }

  getLemma(entry: EntryVersionDto, isRomansh: boolean) {
    if (!isRomansh) {
      // german
      let value = entry.deStichwort;
      if (!!entry.deSubsemantik) {
        value += " (" + entry.deSubsemantik + ")";
      }
      if (!!entry.deGenus) {
        value += " <i>[" + entry.deGenus + "]</i>";
      }
      return value
    } else {
      // romansh
      let value = entry.rmStichwort;
      if (!!entry.rmFlex) {
        value += " <i>[" + entry.rmFlex + "]</i>";
      }
      if (!!entry.rmSubsemantik) {
        value += " (" + entry.rmSubsemantik + ")";
      }
      if (!!entry.rmGenus) {
        value += " <i>[" + entry.rmGenus + "]</i>";
      }
      return value
    }
  }

  getInflectionType(RInflectionType?: string): string {
    if (!RInflectionType) {
      return "";
    }
    switch (RInflectionType) {
      case 'VERB':
        return 'verb';
      case 'NOUN':
        return 'nomen';
      case 'ADJECTIVE':
        return 'adj.';
      case 'PRONOUN':
        return 'pron.';
      case 'OTHER':
        return 'auter';
    }
    return '';
  }

  showDiff(version: EntryVersionInternalDto) {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.titles.edit'),
      nzContent: DiffModalComponent,
      nzClosable: true,
      nzMaskClosable: true,
      nzWidth: 1100,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        original: null,
        change: version,
      },
    });
  }

  private openLemmaModal(entryId?: string) {
    const modal = this.modalService.create({
      nzTitle: !!entryId ? this.translateService.instant('edit.titles.edit') : this.translateService.instant('edit.titles.add'),
      nzContent: MainEntryComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        entryId: entryId,
        // TODO: pass version?
      },
      nzOnOk: () => this.reloadCurrentPage()
    });
  }

  private reloadCurrentPage() {
    this.updatePage.emit(this.paginationInfo!.number);
  }

  private dropEntryVersionConfirmed(entryId: string) {
    this.editorService.dropEntry(this.languageSelectionService.getCurrentLanguage(), entryId).subscribe(() => {
      this.updatePage.emit(this.paginationInfo!.number);
    });
  }

  private rejectEntryVersionConfirmed(item: DictionaryListItem) {
    this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), item.entryId, item.version).subscribe(() => {
      this.updatePage.emit(this.paginationInfo!.number);
    });
  }
}
