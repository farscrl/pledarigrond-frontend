import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-sursilvan-rm',
  templateUrl: './info-sursilvan-rm.component.html',
  styleUrl: './info-sursilvan-rm.component.scss'
})
export class InfoSursilvanRmComponent {
  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }
}
