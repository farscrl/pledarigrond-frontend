import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExportComponent } from 'src/app/features/editor/export/export.component';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';

import * as moment from 'moment';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { LemmaListColumn } from 'src/app/models/lemma-list-column';
import { MainEntryComponent } from 'src/app/features/modify-entry/main-entry/main-entry.component';
import { forkJoin, Observable } from 'rxjs';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { EditorQuery } from 'src/app/models/editor-query';

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
    private languageSelectionService: LanguageSelectionService
  ) { }

  ngOnInit(): void {
  }

  exportResults() {
    const modal = this.modalService.create({
      nzTitle: 'Select fields to export',
      nzContent: ExportComponent,
      nzClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
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

  dropEntry(entryId: string) {
    this.editorService.dropEntry(this.languageSelectionService.getCurrentLanguage(), entryId).subscribe(() => {
      this.updatePage.emit(this.resultPage!.number);
    })
  }

  rejectSelected() {
    const count = this.setOfCheckedId.size;

    const modal = this.modalService.create({
      nzTitle: 'Reject the selected items on this page?',
      nzContent: '<b style="color: red;">' + 'Do you want to reject ' + count + 'suggestions?' + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
      },
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
            subscriptions.push(this.editorService.rejectEntry(this.languageSelectionService.getCurrentLanguage(), lexEntry.id!, lexEntry.mostRecent));
          }
        }
        this.onItemChecked(id, false);
      }
    });

    forkJoin(subscriptions).subscribe(() => {
      this.reloadCurrentPage();
    });
  }

  private openLemmaModal(entryId?: string) {
    const modal = this.modalService.create({
      nzTitle: !!entryId ? 'Edit lemma' : 'Add lemma',
      nzContent: MainEntryComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lexEntryId: entryId,
      },
      nzOnOk: () => this.reloadCurrentPage()
    });
  }

  private reloadCurrentPage() {
    this.updatePage.emit(this.resultPage!.number);
  }
}
