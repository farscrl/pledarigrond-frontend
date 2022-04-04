import { Component, Input, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntryUi } from 'src/app/models/lex-entry';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss']
})
export class VersionHistoryComponent implements OnInit {

  loading = false;

  @Input()
  set lexEntry(lexEntry: LexEntryUi | undefined) {
    this.selectedLexEntry = lexEntry;
    if (this.selectedLexEntry) {
      this.versionHistory = this.selectedLexEntry.versionHistory;
    } else {
      this.versionHistory = []
    }
  }

  private selectedLexEntry?: LexEntryUi;

  versionHistory: readonly LemmaVersion[] = [];

  constructor() { }

  ngOnInit(): void {

  }
}
