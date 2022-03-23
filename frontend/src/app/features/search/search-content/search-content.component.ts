import { Component, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SearchCriteria } from 'src/app/models/search-criteria';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.scss']
})
export class SearchContentComponent implements OnInit {



  searchCriteria: SearchCriteria = new SearchCriteria();
  searchResults: LemmaVersion[] = [];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  search(data: SearchCriteria) {
    this.searchCriteria = data;
    this.searchService.getResults(data).subscribe(data => {
      this.searchResults = data.entries;
    });
  }



}
