import { Component, Input, OnInit } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-surmiran-rm',
    templateUrl: './info-surmiran-rm.component.html',
    imports: [ThousandSeparatorPipe]
})
export class InfoSurmiranRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
