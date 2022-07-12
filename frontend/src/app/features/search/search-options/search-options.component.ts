import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchCriteria } from 'src/app/models/search-criteria';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
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
    if (this.searchCriteria.searchDirection != 'BOTH' || this.searchCriteria.searchMethod !== 'NORMAL' || this.searchCriteria.suggestions !== false || this.searchCriteria.highlight !== false) {
      this.showDetails = true;
    }
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  emitSearch() {
    this.searchCriteriaChange.emit(this.searchCriteria);
  }

  forceSarch() {
    this.forceSearchCriteriaChange.emit(this.searchCriteria);
  }
}
