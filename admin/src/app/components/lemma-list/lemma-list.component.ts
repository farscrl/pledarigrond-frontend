import { Component, Input, OnInit } from '@angular/core';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';

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

  checked = false;
  loading = false;
  indeterminate = false;
  listOfLexEntries: readonly LexEntryUi[] = [new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi(), new LexEntryUi()];
  setOfCheckedId = new Set<string>();

  constructor() { }

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











  onCurrentPageDataChange(listOfCurrentPageData: readonly LexEntryUi[]): void {
    this.listOfLexEntries = listOfCurrentPageData;
    this.refreshCheckedStatus();
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

}
