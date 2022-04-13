import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { SearchService } from 'src/app/services/search.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { SimpleModalService } from "ngx-simple-modal";
import { VerbsModalComponent } from '../verbs-modal/verbs-modal.component';
import { SuggestModificationComponent } from '../suggest-modification/suggest-modification.component';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.scss']
})
export class SearchContentComponent implements OnInit {

  searchCriteria: SearchCriteria = new SearchCriteria();
  searchResults: LemmaVersion[] = [];
  startIndex = 1;
  stopIndex = 15;
  totalEntries = 1;
  currentPage = 0;
  pageSize = 15;

  pagination = new PaginationDisplay();

  constructor(
    private searchService: SearchService,
    private selectedLanguageService: SelectedLanguageService,
    private translateService: TranslateService,
    private simpleModalService: SimpleModalService) { }

  ngOnInit(): void {
  }

  search(data: SearchCriteria) {
    this.searchCriteria = data;
    this.executeSarch();
  }

  modify(version: LemmaVersion) {
    this.simpleModalService.addModal(SuggestModificationComponent, { lemmaVersion: version })
      .subscribe();
  }

  showVerbsModal(version: LemmaVersion) {
    this.simpleModalService.addModal(VerbsModalComponent, { lemmaVersion: version })
      .subscribe();
  }

  goToPage(pageNr: number) {
    this.executeSarch(pageNr);
  }

  getLanguageName(isFirst: boolean) {
    let key = 'search.header_rm';
    if (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') {
      if (isFirst) {
        key = 'search.header_de';
      }
    } else {
      if (!isFirst) {
        key = 'search.header_de';
      }
    }
    return this.translateService.instant(key);
  }

  getLemma(lemma: LemmaVersion, isFirst: boolean) {
    if (
      (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') && isFirst
      || this.searchCriteria.searchDirection === 'ROMANSH' && !isFirst
    ) {
      // german
      let value = lemma.entryValues.DStichwort;
      if (!!lemma.entryValues.DSubsemantik) {
        value += " (" + lemma.entryValues.DSubsemantik + ")";
      }
      if (!!lemma.entryValues.DGenus) {
        value += " <i>[" + lemma.entryValues.DGenus + "]</i>";
      }
      return value
    } else {
      // romansh
      let value = lemma.entryValues.RStichwort;
      if (!!lemma.entryValues.RFlex) {
        value += " <i>[" + lemma.entryValues.RFlex + "]</i>";
      }
      if (!!lemma.entryValues.RSubsemantik) {
        value += " (" + lemma.entryValues.RSubsemantik + ")";
      }
      if (!!lemma.entryValues.RGenus) {
        value += " <i>[" + lemma.entryValues.RGenus + "]</i>";
      }
      return value
    }
  }

  hasVerbLink(lemma: LemmaVersion, isFirst: boolean): boolean {
    if (!lemma.entryValues.rm_flex_type) {
      return false;
    }

    if (
      (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') && isFirst
      || this.searchCriteria.searchDirection === 'ROMANSH' && !isFirst) {
      return false;
    }
    return true;
  }

  private executeSarch(page = 0) {
    this.searchService.getResults(this.selectedLanguageService.getSelectedLanguageUrlSegment(), this.searchCriteria, page).subscribe(data => {
      this.searchResults = data.content;
      this.pageSize = data.size;
      this.startIndex = (data.number * data.size) + 1;
      this.stopIndex = Math.min(data.totalElements, (data.number + 1) * data.size);
      this.totalEntries = data.totalElements;
      this.currentPage = data.number;

      this.generatePagination();
    });
  }

  private generatePagination() {
    const pagination = new PaginationDisplay();
    pagination.showPagination = this.searchResults.length < this.totalEntries;
    pagination.firstPage = 1;
    pagination.currentPage = this.currentPage + 1;
    pagination.lastPage = Math.ceil(this.totalEntries / this.pageSize);
    pagination.isFirst = (pagination.currentPage === pagination.firstPage);
    pagination.isLast = (pagination.currentPage === pagination.lastPage);

    for (let i = Math.max(1, pagination.currentPage - 2); i <= Math.min(pagination.lastPage, pagination.currentPage + 2); i++) {
      const el = new PaginationDisplayElement();
      el.index = i;
      el.isActive = i === pagination.currentPage;
      pagination.elements.push(el);
    }

    this.pagination = pagination;
  }
}

class PaginationDisplay {
  showPagination = false;
  firstPage = 1;
  currentPage = 1;
  lastPage = 1;
  isFirst = false;
  isLast = false;

  elements: PaginationDisplayElement[] = [];
}

class PaginationDisplayElement {
  index = 1;
  isActive = false;
}
