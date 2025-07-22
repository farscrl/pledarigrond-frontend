import { Component, OnInit } from '@angular/core';
import { EditorQuery } from 'src/app/models/editor-query';
import { LemmaListColumn, LemmaListColumnDetail } from 'src/app/models/lemma-list-column';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { DictionaryListItem, PaginationInfo } from '../../../models/dictionary-list';
import { EntryDto } from '../../../models/dictionary';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    standalone: false
})
export class HistoryComponent implements OnInit {
  paginationInfo: PaginationInfo = new PaginationInfo();
  items: DictionaryListItem[]  = [];
  columns: LemmaListColumn = new LemmaListColumn();

  currentEditorQuery?: EditorQuery;

  selectedEntry?: EntryDto;

  userFilter?: string;

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) {
    this.columns = this.generateColumns();
  }

  ngOnInit(): void {
    this.loadPage(0);
  }

  search(editorQuery: EditorQuery) {
    // verified entries
    editorQuery.state = 'PUBLISHED';
    this.currentEditorQuery = editorQuery;
    this.loadPage(0);
  }

  loadPage(page: number) {
    if (!this.currentEditorQuery) {
      return;
    }

    this.editorService.getAllEntries(this.languageSelectionService.getCurrentLanguage(), this.currentEditorQuery!, page).subscribe(page => {
      this.paginationInfo = new PaginationInfo(page);
      this.items = page.content.map(v => ({
        entryId: v.entryId,
        publicationStatus: v.publicationStatus,

        version: v.version,

        selected: false,
        disabled: false
      }));
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
      user: new LemmaListColumnDetail(true, true),
      filter: new LemmaListColumnDetail(true, false),
      entry: new LemmaListColumnDetail(true, true),
      actions: new LemmaListColumnDetail(true, true),
      order: new LemmaListColumnDetail(false, false),
      state: new LemmaListColumnDetail(true, true),
      created: new LemmaListColumnDetail(true, true),

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
      romanshInflectionType: new LemmaListColumnDetail(false, false),
      romanshAdditionalSearchTerms: new LemmaListColumnDetail(true, false),
      romanshEtymology: new LemmaListColumnDetail(true, false),
      category: new LemmaListColumnDetail(true, false),
      comment: new LemmaListColumnDetail(true, false),

      checkMultiple: new LemmaListColumnDetail(false, false),
    }
  }
}
