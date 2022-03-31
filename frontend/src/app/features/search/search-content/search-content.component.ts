import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { SearchService } from 'src/app/services/search.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

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
  currentPage = 1;
  pageSize = 15;

  pagination = new PaginationDisplay();

  constructor(private searchService: SearchService, private selectedLanguageService: SelectedLanguageService, private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  search(data: SearchCriteria) {
    this.searchCriteria = data;
    this.searchService.getResults(this.selectedLanguageService.getSelectedLanguageUrlSegment(), data).subscribe(data => {
      this.searchResults = data.entries;
      this.pageSize = data.pageSize;
      this.startIndex = ((data.currentPage - 1) * data.pageSize) + 1;
      this.stopIndex = Math.min(data.totalEntries, data.currentPage * data.pageSize);
      this.totalEntries = data.totalEntries;
      this.currentPage = data.currentPage;

      this.generatePagination();
    });
  }

  goToPage(pageNr: number) {
    console.log('go to page: ' + pageNr);
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
    if (!lemma.entryValues.maalr_overlay_lang2) {
      return false;
    }

    if (
      (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') && isFirst
      || this.searchCriteria.searchDirection === 'ROMANSH' && !isFirst) {
      return false;
    }
    return true;
  }

  private generatePagination() {
    const pagination = new PaginationDisplay();
    pagination.showPagination = this.searchResults.length < this.totalEntries;
    pagination.firstPage = 1;
    pagination.currentPage = this.currentPage;
    pagination.lastPage = Math.ceil(this.totalEntries / this.pageSize);
    pagination.isFirst = (this.currentPage === pagination.firstPage);
    pagination.isLast = (this.currentPage === pagination.lastPage);

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
