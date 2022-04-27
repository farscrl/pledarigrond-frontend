import { Component, OnInit } from '@angular/core';
import { LemmaListColumn, LemmaListColumnDetail } from 'src/app/models/lemma-list-column';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';
import { EditorSearchCriteria, SearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-lexicon',
  templateUrl: './lexicon.component.html',
  styleUrls: ['./lexicon.component.scss']
})
export class LexiconComponent implements OnInit {

  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  results: Page<LemmaVersion>  = new Page<LemmaVersion>();
  columns: LemmaListColumn = new LemmaListColumn();

  // we only have lemma-versions. the list component expects lex-entries. Thus, we generate fake lex-entries with only one version
  virtualResults: Page<LexEntry> = new Page<LexEntry>();

  selectedLexEntry?: LexEntryUi;

  constructor(private languageSelectionService: LanguageSelectionService, private editorService: EditorService) { }

  ngOnInit(): void {
    this.columns = this.generateColumns();
  }

  search(searchCriteria: EditorSearchCriteria) {
    this.searchCriteria = searchCriteria;
    this.changePage(0);
  }

  changePage(page: number) {
    this.editorService.searchLemmaVersions(this.languageSelectionService.getCurrentLanguage(), this.searchCriteria!, page).subscribe(page => {
      this.results = page;
      this.virtualResults = this.lemmaVersionPageToLexEntryPage(page);
    });
  }

  showLexEntryDetails(lexEntry: LexEntryUi) {
    if (!lexEntry || !lexEntry.id) {
      return;
    }
    // as we only have fake lex-entries, we load the complete lex-entry to show the details
    this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), lexEntry.id!).subscribe((data) => {
      this.selectedLexEntry = data as LexEntryUi;
    });
  }

  private lemmaVersionPageToLexEntryPage(page: Page<LemmaVersion>): Page<LexEntry> {
    const virtualPage = new Page<LexEntry>();
    page.content.forEach(el => {
      const lexEntry = new LexEntry();
      lexEntry.current = el;
      lexEntry.mostRecent = el;
      lexEntry.id = el.lexEntryId;
      virtualPage.content.push(lexEntry);
    });
    virtualPage.pageable = page.pageable;
    virtualPage.last = page.last;
    virtualPage.totalPages = page.totalPages;
    virtualPage.totalElements = page.totalElements;
    virtualPage.first = page.first;
    virtualPage.size = page.size;
    virtualPage.number = page.number;
    virtualPage.sort = page.sort;
    virtualPage.numberOfElements = page.numberOfElements;
    virtualPage.empty = page.empty;

    return virtualPage;
  }

  private generateColumns(): LemmaListColumn {
    return {
      user: new LemmaListColumnDetail(false, false),
      verifier: new LemmaListColumnDetail(false, false),
      filter: new LemmaListColumnDetail(false, false),
      entry: new LemmaListColumnDetail(true, true),
      actions: new LemmaListColumnDetail(true, true),
      order: new LemmaListColumnDetail(true, true),
      state: new LemmaListColumnDetail(false, false),
      created: new LemmaListColumnDetail(false, false),

      german: new LemmaListColumnDetail(true, false),
      germanGrammar: new LemmaListColumnDetail(true, false),
      germanGender: new LemmaListColumnDetail(true, false),
      germanSemantics: new LemmaListColumnDetail(true, false),
      germanLink: new LemmaListColumnDetail(true, false),
      germanAdditionalSearchTerms: new LemmaListColumnDetail(true, false),
      romansh: new LemmaListColumnDetail(true, false),
      romanshGrammar: new LemmaListColumnDetail(true, false),
      romanshGender: new LemmaListColumnDetail(true, false),
      romanshSemantics: new LemmaListColumnDetail(true, false),
      romanshLink: new LemmaListColumnDetail(true, false),
      romanshConjugation: new LemmaListColumnDetail(true, false),
      romanshAdditionalSearchTerms: new LemmaListColumnDetail(true, false),
      category: new LemmaListColumnDetail(true, false),
      comment: new LemmaListColumnDetail(true, false),

      checkMultiple: new LemmaListColumnDetail(false, false),
    }
  }
}
