import { Component, OnInit } from '@angular/core';
import { LemmaListColumn, LemmaListColumnDetail } from 'src/app/models/lemma-list-column';
import { EditorSearchCriteria } from 'src/app/models/lucene-search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { Subject, takeUntil } from 'rxjs';
import { DictionaryListItem, PaginationInfo } from '../../../models/dictionary-list';
import { EntryDto } from '../../../models/dictionary';

@Component({
    selector: 'app-lexicon',
    templateUrl: './lexicon.component.html',
    styleUrls: ['./lexicon.component.scss'],
    standalone: false
})
export class LexiconComponent implements OnInit {
  paginationInfo: PaginationInfo = new PaginationInfo();
  items: DictionaryListItem[]  = [];
  columns: LemmaListColumn = new LemmaListColumn();

  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  selectedEntry?: EntryDto;

  isLoading = false;

  private cancelPreviousRequest = new Subject<void>();

  constructor(private languageSelectionService: LanguageSelectionService, private editorService: EditorService) {
    this.columns = this.generateColumns();
  }

  ngOnInit(): void {
    this.loadPage(0);
  }

  search(searchCriteria: EditorSearchCriteria) {
    this.searchCriteria = searchCriteria;
    this.loadPage(0);
  }

  loadPage(page: number) {
    this.cancelPreviousRequest.next();

    this.isLoading = true;

    this.editorService.searchLemmaVersions(this.languageSelectionService.getCurrentLanguage(), this.searchCriteria!, page).pipe(
      takeUntil(this.cancelPreviousRequest)
    ).subscribe(page => {
      this.paginationInfo = new PaginationInfo(page);
      this.items = page.content.map(v => ({
        entryId: v.entryId,
        publicationStatus: v.publicationStatus,

        version: v,

        selected: false,
        disabled: false
      }));
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.error(error);
    });
  }

  showLexEntryDetails(entryId: string) {
    if (!entryId) {
      return;
    }
    this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), entryId).subscribe((data) => {
      this.selectedEntry = data;
    });
  }

  private generateColumns(): LemmaListColumn {
    return {
      diff: new LemmaListColumnDetail(false, false),
      user: new LemmaListColumnDetail(false, false),
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
      romanshInflectionType: new LemmaListColumnDetail(true, true),
      romanshAdditionalSearchTerms: new LemmaListColumnDetail(true, false),
      romanshEtymology: new LemmaListColumnDetail(true, false),
      category: new LemmaListColumnDetail(true, false),
      comment: new LemmaListColumnDetail(true, false),

      checkMultiple: new LemmaListColumnDetail(false, false),
    }
  }
}
