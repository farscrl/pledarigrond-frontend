import { Component, Input, OnInit } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-sutsilv-de',
    templateUrl: './info-sutsilv-de.component.html',
    imports: [ThousandSeparatorPipe]
})
export class InfoSutsilvDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
