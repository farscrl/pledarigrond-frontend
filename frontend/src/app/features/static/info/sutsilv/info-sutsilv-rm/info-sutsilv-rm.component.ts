import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-sutsilv-rm',
    templateUrl: './info-sutsilv-rm.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThousandSeparatorPipe]
})
export class InfoSutsilvRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
