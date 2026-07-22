import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-sutsilv-de',
    templateUrl: './info-sutsilv-de.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThousandSeparatorPipe]
})
export class InfoSutsilvDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
