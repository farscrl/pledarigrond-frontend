import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-surmiran-rm',
    templateUrl: './info-surmiran-rm.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThousandSeparatorPipe]
})
export class InfoSurmiranRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
