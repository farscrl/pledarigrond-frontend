import { Component, OnInit } from '@angular/core';
import { MatomoTrackClickDirective } from 'ngx-matomo-client';

@Component({
    selector: 'app-sursilvan-placeholder',
    templateUrl: './sursilvan-placeholder.component.html',
    styleUrls: ['./sursilvan-placeholder.component.scss'],
    imports: [MatomoTrackClickDirective]
})
export class SursilvanPlaceholderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
