import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-rumgr-rm',
    templateUrl: './info-rumgr-rm.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThousandSeparatorPipe]
})
export class InfoRumgrRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
