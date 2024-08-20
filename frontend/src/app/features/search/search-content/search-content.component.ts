import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SearchCriteria, SearchCriteriaUrl } from 'src/app/models/search-criteria';
import { SearchService } from 'src/app/services/search.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { NgxModalService } from "ngx-modalview";
import { VerbsModalComponent } from '../verbs-modal/verbs-modal.component';
import { SuggestModificationComponent } from '../suggest-modification/suggest-modification.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionComponent } from 'src/app/components/footer/suggestion/suggestion.component';
import { MatomoTracker } from "ngx-matomo-client";

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.scss']
})
export class SearchContentComponent implements OnInit, OnDestroy {

  searchCriteria: SearchCriteria = new SearchCriteria();
  searchResults: LemmaVersion[] = [];
  searchSuggestionsRm: string[] = [];
  searchSuggestionsDe: string[] = [];
  startIndex = 1;
  stopIndex = 15;
  totalEntries = 1;
  currentPage = 0;
  pageSize = 15;

  pagination = new PaginationDisplay();

  updateUrlParamsTimer: any;

  constructor(
    private searchService: SearchService,
    private selectedLanguageService: SelectedLanguageService,
    private translateService: TranslateService,
    private modalService: NgxModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tracker: MatomoTracker,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const urlSerarchCriteria = new SearchCriteria();
      if (params['searchPhrase'] !== "") {
        urlSerarchCriteria.searchPhrase = params['searchPhrase'];
      }
      if (params['searchDirection'] !== "") {
        switch(params['searchDirection']) {
          case 'romansh':
            urlSerarchCriteria.searchDirection = 'ROMANSH';
            break;
          case 'german':
            urlSerarchCriteria.searchDirection = 'GERMAN';
            break;
          default:
            urlSerarchCriteria.searchDirection = 'BOTH';
        }
      }
      if (params['searchMethod'] !== "") {
        switch(params['searchMethod']) {
          case 'intern':
            urlSerarchCriteria.searchMethod = 'INTERN';
            break;
          case 'prefix':
            urlSerarchCriteria.searchMethod = 'PREFIX';
            break;
          case 'suffix':
            urlSerarchCriteria.searchMethod = 'SUFFIX';
            break;
          case 'exact':
            urlSerarchCriteria.searchMethod = 'EXACT';
            break;
          default:
            urlSerarchCriteria.searchMethod = 'NORMAL';
        }
      }
      if (params['highlight']) {
        urlSerarchCriteria.highlight = true;
      }
      if (params['suggestions']) {
        urlSerarchCriteria.suggestions = true;
      }

      if (urlSerarchCriteria.searchPhrase === this.searchCriteria.searchPhrase &&
        urlSerarchCriteria.searchDirection === this.searchCriteria.searchDirection &&
        urlSerarchCriteria.searchMethod === this.searchCriteria.searchMethod &&
        urlSerarchCriteria.highlight === this.searchCriteria.highlight &&
        urlSerarchCriteria.suggestions === this.searchCriteria.suggestions) {
          // search criteria identic -> do not search again
          return;
        }
      if (urlSerarchCriteria.searchPhrase && urlSerarchCriteria.searchPhrase !== "") {
        this.search(urlSerarchCriteria);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.updateUrlParamsTimer);
  }

  search(data: SearchCriteria) {
    this.searchCriteria = data;
    this.executeSarch();
    clearTimeout(this.updateUrlParamsTimer);
    this.updateUrlParamsTimer = setTimeout(() => {
      this.updateUrlParams();
    }, 3000);
  }

  searchImmediate(data: SearchCriteria) {
    this.searchCriteria = data;
    this.executeSarch();
    clearTimeout(this.updateUrlParamsTimer);
    this.updateUrlParams();
  }

  modify(version: LemmaVersion) {
    this.modalService.addModal(SuggestModificationComponent, { lemmaVersion: version })
      .subscribe();
  }

  showVerbsModal(version: LemmaVersion) {
    this.modalService.addModal(VerbsModalComponent, { lemmaVersion: version })
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

  getIsSortActive(isFirst: boolean): boolean {
    if (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') {
      if (isFirst) {
        return this.searchCriteria.sortBy === 'GERMAN';
      } else {
        return this.searchCriteria.sortBy === 'ROMANSH';
      }
    } else {
      if (!isFirst) {
        return this.searchCriteria.sortBy === 'ROMANSH';
      } else {
        return this.searchCriteria.sortBy === 'GERMAN';
      }
    }
  }

  toggleSearchBy(isFirst: boolean) {
    debugger;
    const oldDirection = this.searchCriteria.sortBy;
    if (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') {
      if (isFirst) {
        this.searchCriteria.sortBy = 'GERMAN';
      } else {
        this.searchCriteria.sortBy = 'ROMANSH';
      }
    } else {
      if (!isFirst) {
        this.searchCriteria.sortBy =  'GERMAN';
      } else {
        this.searchCriteria.sortBy = 'ROMANSH';
      }
    }
    if (oldDirection !== this.searchCriteria.sortBy) {
      this.searchImmediate(this.searchCriteria);
    }
  }

  containsLink(lemma: LemmaVersion, isFirst: boolean): string | undefined {
    if (
      (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') && isFirst
      || this.searchCriteria.searchDirection === 'ROMANSH' && !isFirst
    ) {
      // german
      if(lemma.lemmaValues.DRedirect && lemma.lemmaValues.DRedirect != "" && lemma.lemmaValues.DStichwort?.startsWith('cf. ')) {
        return lemma.lemmaValues.DStichwort?.slice(4);
      } else {
        return undefined;
      }
    } else {
      // romansh
      if (lemma.lemmaValues.RRedirect && lemma.lemmaValues.RRedirect != "" && lemma.lemmaValues.RStichwort?.startsWith('cf. ')) {
        return lemma.lemmaValues.RStichwort?.slice(4);
      }else {
        return undefined;
      }
    }
  }

  getLemma(lemma: LemmaVersion, isFirst: boolean, overrideMainText = "") {
    if (
      (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') && isFirst
      || this.searchCriteria.searchDirection === 'ROMANSH' && !isFirst
    ) {
      // german
      let value = overrideMainText !== "" ? overrideMainText : lemma.lemmaValues.DStichwort;
      if (!!lemma.lemmaValues.DSubsemantik) {
        value += " (" + lemma.lemmaValues.DSubsemantik + ")";
      }
      if (!!lemma.lemmaValues.DGenus) {
        value += " <i>[" + lemma.lemmaValues.DGenus + "]</i>";
      }
      return value
    } else {
      // romansh
      let value = overrideMainText !== "" ? overrideMainText : lemma.lemmaValues.RStichwort;
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

  linkToLemma(searchPhrase: string) {
    this.searchCriteria = new SearchCriteria();
    this.searchCriteria.searchPhrase = searchPhrase;
    this.search(this.searchCriteria);
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

  openSuggestionModal() {
    this.modalService.addModal(SuggestionComponent, null)
      .subscribe();
  }

  private executeSarch(page = 0) {
    this.searchService.getResults(this.selectedLanguageService.getSelectedLanguageUrlSegment(), this.searchCriteria, page).subscribe(data => {
      this.searchResults = data.content;
      this.searchSuggestionsRm = data.suggestionsRm;
      this.searchSuggestionsDe = data.suggestionsDe;
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
        queryParamsHandling: 'merge',
    });

    if (this.searchCriteria.searchPhrase != '') {
      this.tracker.trackEvent('TSCHERTGA', 'tschertga ' + this.selectedLanguageService.getSelectedLanguageUrlSegment());
    }
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
