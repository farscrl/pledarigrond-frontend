import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-surmiran-de',
    templateUrl: './info-surmiran-de.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThousandSeparatorPipe]
})
export class InfoSurmiranDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
