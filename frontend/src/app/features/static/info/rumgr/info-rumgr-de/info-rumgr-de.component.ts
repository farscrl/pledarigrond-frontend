import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-rumgr-de',
    templateUrl: './info-rumgr-de.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThousandSeparatorPipe]
})
export class InfoRumgrDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
