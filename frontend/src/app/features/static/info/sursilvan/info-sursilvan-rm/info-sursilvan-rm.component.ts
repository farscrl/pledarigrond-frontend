import { Component, Input } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
    selector: 'app-info-sursilvan-rm',
    templateUrl: './info-sursilvan-rm.component.html',
    imports: [
        ThousandSeparatorPipe
    ],
    styleUrl: './info-sursilvan-rm.component.scss'
})
export class InfoSursilvanRmComponent {
  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }
}
