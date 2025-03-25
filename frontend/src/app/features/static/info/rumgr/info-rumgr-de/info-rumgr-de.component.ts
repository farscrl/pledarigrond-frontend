import { Component, Input, OnInit } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-rumgr-de',
    templateUrl: './info-rumgr-de.component.html',
    imports: [ThousandSeparatorPipe]
})
export class InfoRumgrDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
