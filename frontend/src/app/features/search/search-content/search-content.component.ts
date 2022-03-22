import { Component, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.scss']
})
export class SearchContentComponent implements OnInit {



  searchPhrase: string = "";
  searchResults: LemmaVersion[] = [];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  search(data: any) {
    this.searchService.getResults(this.searchPhrase).subscribe(data => {
      this.searchResults = data.entries;
    });
  }



}
