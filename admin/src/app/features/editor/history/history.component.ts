import { Component, OnInit } from '@angular/core';
import { EditorQuery } from 'src/app/models/editor-query';
import { LemmaListColumn, LemmaListColumnDetail } from 'src/app/models/lemma-list-column';
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
  columns: LemmaListColumn = new LemmaListColumn();

  currentEditorQuery?: EditorQuery;

  selectedLexEntry?: LexEntryUi;

  userFilter?: string;
  verifierFilter?: string;

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.columns = this.generateColumns();
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

  private generateColumns(): LemmaListColumn {
    return {
      user: new LemmaListColumnDetail(true, true),
      verifier: new LemmaListColumnDetail(true, true),
      filter: new LemmaListColumnDetail(true, true),
      entry: new LemmaListColumnDetail(true, true),
      options: new LemmaListColumnDetail(true, true),
      order: new LemmaListColumnDetail(false, false),
      state: new LemmaListColumnDetail(true, true),
      created: new LemmaListColumnDetail(true, true),

      german: new LemmaListColumnDetail(true, false),
      germanGrammar: new LemmaListColumnDetail(true, false),
      germanGender: new LemmaListColumnDetail(true, false),
      germanSemantics: new LemmaListColumnDetail(true, false),
      germanLink: new LemmaListColumnDetail(true, false),
      romansh: new LemmaListColumnDetail(true, false),
      romanshGrammar: new LemmaListColumnDetail(true, false),
      romanshGender: new LemmaListColumnDetail(true, false),
      romanshSemantics: new LemmaListColumnDetail(true, false),
      romanshLink: new LemmaListColumnDetail(true, false),
      romanshConjugation: new LemmaListColumnDetail(true, false),
      romanshAdditionalSearchTerms: new LemmaListColumnDetail(true, false),
      category: new LemmaListColumnDetail(true, false),
      comment: new LemmaListColumnDetail(true, false),

      checkMultiple: new LemmaListColumnDetail(true, true),
    }
  }
}
