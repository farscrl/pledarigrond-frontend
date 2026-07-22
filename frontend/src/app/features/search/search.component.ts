import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SearchContentComponent } from './search-content/search-content.component';
import { GlossaryLinksComponent } from './glossary-links/glossary-links.component';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SearchContentComponent, GlossaryLinksComponent]
})
export class SearchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
