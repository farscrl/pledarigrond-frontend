import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExportComponent } from 'src/app/features/editor/export/export.component';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';

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

@Component({
  selector: 'app-lemma-list',
  templateUrl: './lemma-list.component.html',
  styleUrls: ['./lemma-list.component.scss']
})
export class LemmaListComponent implements OnInit {

  @Input()
  columns: LemmaListColumn = new LemmaListColumn();

  @Input()
  filter?: SearchCriteria | EditorQuery;

  @Input() set lexEntries(page: Page<LexEntry> | undefined) {
    this.resultPage = page;
    if (!!page) {
      this.listOfLexEntries = page.content as LexEntryUi[];
    }
    this.showDetailsForLexEntry.emit(undefined);
  }
  get lexEntries(): Page<LexEntry> | undefined {
      return this.resultPage;
  }

  @Input()
  showRejectButton = false;

  @Output()
  updatePage = new EventEmitter<number>();

  @Output()
  showDetailsForLexEntry = new EventEmitter<LexEntryUi>();

  @Output()
  addUserFilter = new EventEmitter<string>();
  @Output()
  addVerifierFilter = new EventEmitter<string>();

  // used to pass math functions to template
  math = Math;


  resultPage?: Page<LexEntry>;
  checked = false;
  loading = false;
  indeterminate = false;
  listOfLexEntries: LexEntryUi[] = [];
  setOfCheckedId = new Set<string>();

  constructor(
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
  }

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

  selectRow(lexEntry: LexEntryUi) {
    const isSelected = lexEntry.selected;
    this.listOfLexEntries.forEach(e => {
      e.selected = false;
    });
    lexEntry.selected = !isSelected;

    if (lexEntry.selected) {
      this.showDetailsForLexEntry.emit(lexEntry);
    } else {
      this.showDetailsForLexEntry.emit(undefined);
    }
  }

  filterUser(user?: string) {
    this.addUserFilter.emit(user);
  }

  filterVerifier(verifier?: string) {
    this.addVerifierFilter.emit(verifier);
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfLexEntries.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id!));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id!)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.listOfLexEntries
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id!, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  formateDate(timestamp: number): string {
    return moment(timestamp).format("DD-MM-YYYY");
  }

  formateTime(timestamp: number): string {
    return moment(timestamp).format("HH:mm:ss")
  }

  addEntry() {
    this.openLemmaModal();
  }

  editEntry(entryId: string) {
    this.openLemmaModal(entryId);
  }

  dropEntry(entry: LexEntry) {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma.delete.title'),
      nzContent: '<b style="color: red;">' +  entry.current.lemmaValues.DStichwort + ' / ' + entry.current.lemmaValues.RStichwort + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzCancelText: this.translateService.instant('lexicon.lemma.delete.cancel'),
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.dropEntryConfirmed(entry.id!),
      nzOnCancel: () => {}
    });
  }

  rejectEntry(entry: LexEntry) {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma.reject.title'),
      nzContent: '<b style="color: red;">' +  entry.current.lemmaValues.DStichwort + ' / ' + entry.current.lemmaValues.RStichwort + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzCancelText: this.translateService.instant('lexicon.lemma.reject.cancel'),
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.dropRejectConfirmed(entry!),
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
      const items =this.listOfLexEntries.filter(entry => entry.id === id);
      if (items && items.length === 1) {
        const lexEntry = items[0];

        // only applicable to unverified items
        if (lexEntry.mostRecent.verification === 'UNVERIFIED') {
          if (lexEntry.mostRecent.status === 'NEW_ENTRY') {
            // drop new entries
            subscriptions.push(this.editorService.dropEntry(this.languageSelectionService.getCurrentLanguage(), lexEntry.id!));
          } else {
            // reject changed entries
            subscriptions.push(this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), lexEntry.id!, lexEntry.mostRecent));
          }
        }
        this.onItemChecked(id, false);
      }
    });

    forkJoin(subscriptions).subscribe(() => {
      this.reloadCurrentPage();
    });
  }

  startReorder(lexEntry: LexEntry, dictionaryLanguage: DictionaryLanguage) {
    const modal = this.modalService.create({
      nzContent: ChangeSortOrderComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 500,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        lexEntry: lexEntry,
        dictionaryLanguage: dictionaryLanguage,
      },
      nzOnOk: () => this.reloadCurrentPage()
    });
  }

  getLemma(entry: LexEntry, isRomansh: boolean) {
    if (!isRomansh) {
      // german
      let value = entry.mostRecent.lemmaValues.DStichwort;
      if (!!entry.mostRecent.lemmaValues.DSubsemantik) {
        value += " (" + entry.mostRecent.lemmaValues.DSubsemantik + ")";
      }
      if (!!entry.mostRecent.lemmaValues.DGenus) {
        value += " <i>[" + entry.mostRecent.lemmaValues.DGenus + "]</i>";
      }
      return value
    } else {
      // romansh
      let value = entry.mostRecent.lemmaValues.RStichwort;
      if (!!entry.mostRecent.lemmaValues.RFlex) {
        value += " <i>[" + entry.mostRecent.lemmaValues.RFlex + "]</i>";
      }
      if (!!entry.mostRecent.lemmaValues.RSubsemantik) {
        value += " (" + entry.mostRecent.lemmaValues.RSubsemantik + ")";
      }
      if (!!entry.mostRecent.lemmaValues.RGenus) {
        value += " <i>[" + entry.mostRecent.lemmaValues.RGenus + "]</i>";
      }
      return value
    }
  }

  getInflectionType(RInflectionType?: string): string {
    if (!RInflectionType) {
      return "";
    }
    switch (RInflectionType) {
      case 'V':
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

  showDiff(lexEntry: LexEntry) {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.titles.edit'),
      nzContent: DiffModalComponent,
      nzClosable: true,
      nzMaskClosable: true,
      nzWidth: 1100,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        lexEntry: lexEntry,
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
        lexEntryId: entryId,
      },
      nzOnOk: () => this.reloadCurrentPage()
    });
  }

  private reloadCurrentPage() {
    this.updatePage.emit(this.resultPage!.number);
  }

  private dropEntryConfirmed(entryId: string) {
    this.editorService.dropEntry(this.languageSelectionService.getCurrentLanguage(), entryId).subscribe(() => {
      this.updatePage.emit(this.resultPage!.number);
    });
  }

  private dropRejectConfirmed(lexEntry: LexEntry) {
    this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), lexEntry.id!, lexEntry.mostRecent).subscribe(() => {
      this.updatePage.emit(this.resultPage!.number);
    });
  }
}
