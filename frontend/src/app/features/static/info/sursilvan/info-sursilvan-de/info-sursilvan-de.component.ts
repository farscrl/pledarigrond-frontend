import { Component, Input } from '@angular/core';
import { ThousandSeparatorPipe } from '../../../../../pipes/thousand-separator.pipe';

@Component({
  selector: 'app-info-sursilvan-de',
  templateUrl: './info-sursilvan-de.component.html',
  styleUrl: './info-sursilvan-de.component.scss',
  imports: [
    ThousandSeparatorPipe
  ]
})
export class InfoSursilvanDeComponent {
  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }
}
