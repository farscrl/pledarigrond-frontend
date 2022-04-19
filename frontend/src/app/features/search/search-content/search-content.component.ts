import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SearchCriteria, SearchCriteriaUrl } from 'src/app/models/search-criteria';
import { SearchService } from 'src/app/services/search.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { SimpleModalService } from "ngx-simple-modal";
import { VerbsModalComponent } from '../verbs-modal/verbs-modal.component';
import { SuggestModificationComponent } from '../suggest-modification/suggest-modification.component';
import { ActivatedRoute, Router } from '@angular/router';

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
    private simpleModalService: SimpleModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams['searchPhrase'] !== "") {
      this.searchCriteria.searchPhrase = this.activatedRoute.snapshot.queryParams['searchPhrase'];
    }
    if (this.activatedRoute.snapshot.queryParams['searchDirection'] !== "") {
      switch(this.activatedRoute.snapshot.queryParams['searchDirection']) {
        case 'romansh':
          this.searchCriteria.searchDirection = 'ROMANSH';
          break;
        case 'german':
          this.searchCriteria.searchDirection = 'GERMAN';
          break;
        default:
          this.searchCriteria.searchDirection = 'BOTH';
      }
    }
    if (this.activatedRoute.snapshot.queryParams['searchMethod'] !== "") {
      switch(this.activatedRoute.snapshot.queryParams['searchMethod']) {
        case 'intern':
          this.searchCriteria.searchMethod = 'INTERN';
          break;
        case 'prefix':
          this.searchCriteria.searchMethod = 'PREFIX';
          break;
        case 'suffix':
          this.searchCriteria.searchMethod = 'SUFFIX';
          break;
        case 'exact':
          this.searchCriteria.searchMethod = 'EXACT';
          break;
        default:
          this.searchCriteria.searchMethod = 'NORMAL';
      }
    }
    if (this.activatedRoute.snapshot.queryParams['highlight']) {
      this.searchCriteria.highlight = true;
    }
    if (this.activatedRoute.snapshot.queryParams['suggestions']) {
      this.searchCriteria.suggestions = true;
    }

    if (this.searchCriteria.searchPhrase !== "") {
      this.search(this.searchCriteria);
    }
  }

  search(data: SearchCriteria) {
    this.searchCriteria = data;
    this.updateUrlParams();
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
      let value = lemma.lemmaValues.DStichwort;
      if (!!lemma.lemmaValues.DSubsemantik) {
        value += " (" + lemma.lemmaValues.DSubsemantik + ")";
      }
      if (!!lemma.lemmaValues.DGenus) {
        value += " <i>[" + lemma.lemmaValues.DGenus + "]</i>";
      }
      return value
    } else {
      // romansh
      let value = lemma.lemmaValues.RStichwort;
      if (!!lemma.lemmaValues.RFlex) {
        value += " <i>[" + lemma.lemmaValues.RFlex + "]</i>";
      }
      if (!!lemma.lemmaValues.RSubsemantik) {
        value += " (" + lemma.lemmaValues.RSubsemantik + ")";
      }
      if (!!lemma.lemmaValues.RGenus) {
        value += " <i>[" + lemma.lemmaValues.RGenus + "]</i>";
      }
      return value
    }
  }

  hasVerbLink(lemma: LemmaVersion, isFirst: boolean): boolean {
    if (!lemma.lemmaValues.RInflectionType || lemma.lemmaValues.RInflectionType !== 'V') {
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

  private updateUrlParams() {
    const url = new SearchCriteriaUrl();
    if (this.searchCriteria.searchPhrase != "") {
      url.searchPhrase = this.searchCriteria.searchPhrase;
    }

    if (this.searchCriteria.searchDirection != 'BOTH') {
      if (this.searchCriteria.searchDirection === 'GERMAN') {
        url.searchDirection = 'german';
      } else {
        url.searchDirection = 'romansh';
      }
    }

    if (this.searchCriteria.searchMethod != 'NORMAL') {
      if (this.searchCriteria.searchMethod === 'INTERN') {
        url.searchMethod = 'intern';
      } else if (this.searchCriteria.searchMethod === 'SUFFIX') {
        url.searchMethod = 'suffix';
      } else if (this.searchCriteria.searchMethod === 'PREFIX') {
        url.searchMethod = 'prefix';
      }else if (this.searchCriteria.searchMethod === 'EXACT') {
        url.searchMethod = 'exact';
      }
    }
    if (this.searchCriteria.suggestions != false) {
      url.suggestions = true;
    }
    if (this.searchCriteria.highlight != false) {
      url.highlight = true;
    }

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: url,
        replaceUrl: true,
        queryParamsHandling: 'merge',
      });
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
