import { Component, OnInit } from '@angular/core';
import { EditorQuery } from 'src/app/models/editor-query';
import { LemmaListColumn, LemmaListColumnDetail } from 'src/app/models/lemma-list-column';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';


@Component({
    selector: 'app-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss'],
    standalone: false
})
export class SuggestionsComponent implements OnInit {

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
    editorQuery.verification = 'UNVERIFIED';
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
      diff: new LemmaListColumnDetail(true, true),
      user: new LemmaListColumnDetail(true, true),
      verifier: new LemmaListColumnDetail(false, false),
      filter: new LemmaListColumnDetail(true, true),
      entry: new LemmaListColumnDetail(true, true),
      actions: new LemmaListColumnDetail(true, true),
      order: new LemmaListColumnDetail(false, false),
      state: new LemmaListColumnDetail(true, true),
      created: new LemmaListColumnDetail(true, true),

      german: new LemmaListColumnDetail(true, false),
      germanGrammar: new LemmaListColumnDetail(false, false),
      germanGender: new LemmaListColumnDetail(false, false),
      germanSemantics: new LemmaListColumnDetail(false, false),
      germanLink: new LemmaListColumnDetail(false, false),
      germanAdditionalSearchTerms: new LemmaListColumnDetail(false, false),
      romansh: new LemmaListColumnDetail(true, false),
      romanshGrammar: new LemmaListColumnDetail(false, false),
      romanshGender: new LemmaListColumnDetail(false, false),
      romanshSemantics: new LemmaListColumnDetail(false, false),
      romanshLink: new LemmaListColumnDetail(false, false),
      romanshConjugation: new LemmaListColumnDetail(false, false),
      romanshInflectionType: new LemmaListColumnDetail(false, false),
      romanshAdditionalSearchTerms: new LemmaListColumnDetail(false, false),
      romanshEtymology: new LemmaListColumnDetail(false, false),
      category: new LemmaListColumnDetail(false, false),
      comment: new LemmaListColumnDetail(true, false),

      checkMultiple: new LemmaListColumnDetail(true, false),
    }
  }
}
