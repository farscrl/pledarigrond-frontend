import { Component, Input, OnInit } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-rumgr-rm',
    templateUrl: './info-rumgr-rm.component.html',
    imports: [ThousandSeparatorPipe]
})
export class InfoRumgrRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
