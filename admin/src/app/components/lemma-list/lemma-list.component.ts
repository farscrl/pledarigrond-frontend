import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExportComponent } from 'src/app/features/editor/export/export.component';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';

import * as moment from 'moment';

@Component({
  selector: 'app-lemma-list',
  templateUrl: './lemma-list.component.html',
  styleUrls: ['./lemma-list.component.scss']
})
export class LemmaListComponent implements OnInit {

  @Input()
  showCreatorData = false;

  @Input()
  showDetailedColumns = false;

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

  // column options
  // // creator
  showUserColumn = true;
  showFilterColumn = true;
  showEntryColumn = true;
  showOptionsColumn = true;
  showStateColumn = true;
  showCreatedColumn = true;
  // // lemma
  showGermanColumn = false;
  showGermanGrammColumn = false;
  showGermanGenusColumn = false;
  showGermanSemanticsColumn = false;
  showGermanLinkColumn = false;
  showRomanshColumn = false;
  showRomansGrammColumn = false;
  showRomanshGenusColumn = false;
  showRomanshSemanticsColumn = false;
  showRomanshLinkColumn = false;
  showCategoryColumn = false;
  showConjugationColumn = false;
  showAdditionalSearchTermsColumn = false;
  showCommentColumn = false;
  // // commands
  showCheckMultiple = false;

  resultPage?: Page<LexEntry>;
  checked = false;
  loading = false;
  indeterminate = false;
  listOfLexEntries: LexEntryUi[] = [];
  setOfCheckedId = new Set<string>();

  constructor(private modalService: NzModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    if (this.showCreatorData) {
      this.showUserColumn = true;
      this.showFilterColumn = true;
      this.showEntryColumn = true;
      this.showOptionsColumn = true;
      this.showStateColumn = true;
      this.showCreatedColumn = true;
    }
  }

  exportResults() {
    const modal = this.modalService.create({
      nzTitle: 'Select fields to export',
      nzContent: ExportComponent,
      nzClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
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
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.listOfLexEntries
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    return moment(timestamp).format("hh:mm:ss")
  }
}
