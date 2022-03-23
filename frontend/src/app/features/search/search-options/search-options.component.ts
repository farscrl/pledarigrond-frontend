import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchCriteria } from 'src/app/models/search-criteria';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  @Output()
  searchEvent = new EventEmitter<SearchCriteria>();

  searchCriteria: SearchCriteria = new SearchCriteria();

  showDetails = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
    console.log("toggle")
  }

  emitSearch() {
    this.searchEvent.emit(this.searchCriteria);
  }
}
