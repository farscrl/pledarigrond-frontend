import { Component, OnInit } from '@angular/core';
import { EditorQuery } from 'src/app/models/editor-query';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  results: Page<LexEntry>  = new Page<LexEntry>();

  currentEditorQuery?: EditorQuery;

  selectedLexEntry?: LexEntryUi;

  userFilter?: string;
  verifierFilter?: string;

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
  }

  search(editorQuery: EditorQuery) {
    // only unverified entries
    editorQuery.verification = 'ACCEPTED';
    this.currentEditorQuery = editorQuery;
    this.changePage(0);
  }

  changePage(page: number) {
    this.editorService.getAllLexEntries(this.languageSelectionService.getCurrentLanguage(), this.currentEditorQuery!, page).subscribe(page => {
      this.results = page;
    });
  }

  showLexEntryDetails(lexEntry: LexEntryUi) {
    this.selectedLexEntry = lexEntry;
  }
}
