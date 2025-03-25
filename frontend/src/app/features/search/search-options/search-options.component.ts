import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchCriteria } from 'src/app/models/search-criteria';

@Component({
    selector: 'app-search-options',
    templateUrl: './search-options.component.html',
    styleUrls: ['./search-options.component.scss'],
    standalone: false
})
export class SearchOptionsComponent implements OnInit {

  @Input()
  searchCriteria: SearchCriteria = new SearchCriteria();

  @Output()
  searchCriteriaChange = new EventEmitter<SearchCriteria>();

  @Output()
  forceSearchCriteriaChange = new EventEmitter<SearchCriteria>();

  showDetails = false;

  constructor() { }

  ngOnInit(): void {
    if (this.searchCriteria.searchDirection != 'BOTH' || this.searchCriteria.searchMethod !== 'NORMAL' || this.searchCriteria.highlight !== false) {
      this.showDetails = true;
    }
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  emitSearch(resetSortBy: boolean) {
    if (resetSortBy) {
      this.resetSortBy();
    }

    this.searchCriteriaChange.emit(this.searchCriteria);
  }

  forceSarch() {
    this.forceSearchCriteriaChange.emit(this.searchCriteria);
  }

  private resetSortBy() {
    if (this.searchCriteria.searchDirection === 'BOTH' || this.searchCriteria.searchDirection === 'GERMAN') {
      this.searchCriteria.sortBy = 'GERMAN';
    } else {
      this.searchCriteria.sortBy = 'ROMANSH';
    }
  }
}
