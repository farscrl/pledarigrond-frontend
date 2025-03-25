import { Component, OnInit } from '@angular/core';
import { GlossaryLinksComponent } from '../search/glossary-links/glossary-links.component';
import { MatomoTrackClickDirective } from 'ngx-matomo-client';

@Component({
    selector: 'app-puter-placeholder',
    templateUrl: './puter-placeholder.component.html',
    styleUrls: ['./puter-placeholder.component.scss'],
    imports: [GlossaryLinksComponent, MatomoTrackClickDirective]
})
export class PuterPlaceholderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
