import { Component, Input, OnInit } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-surmiran-de',
    templateUrl: './info-surmiran-de.component.html',
    imports: [ThousandSeparatorPipe]
})
export class InfoSurmiranDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
