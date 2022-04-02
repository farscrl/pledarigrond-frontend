import { Component, OnInit } from '@angular/core';
import { EditorSearchCriteria } from 'src/app/models/search-criteria';

@Component({
  selector: 'app-lexicon-filter',
  templateUrl: './lexicon-filter.component.html',
  styleUrls: ['./lexicon-filter.component.scss']
})
export class LexiconFilterComponent implements OnInit {

  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  showSearchDetails = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDetails() {
    this.showSearchDetails = !this.showSearchDetails;
  }

}
