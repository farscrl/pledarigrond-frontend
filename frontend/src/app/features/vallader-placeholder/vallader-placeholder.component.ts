import { Component, OnInit } from '@angular/core';
import { GlossaryLinksComponent } from '../search/glossary-links/glossary-links.component';
import { MatomoTrackClickDirective } from 'ngx-matomo-client';

@Component({
    selector: 'app-vallader-placeholder',
    templateUrl: './vallader-placeholder.component.html',
    styleUrls: ['./vallader-placeholder.component.scss'],
    imports: [GlossaryLinksComponent, MatomoTrackClickDirective]
})
export class ValladerPlaceholderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
