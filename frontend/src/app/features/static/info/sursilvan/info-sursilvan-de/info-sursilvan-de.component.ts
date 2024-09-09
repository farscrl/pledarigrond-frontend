import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-sursilvan-de',
  templateUrl: './info-sursilvan-de.component.html',
  styleUrl: './info-sursilvan-de.component.scss'
})
export class InfoSursilvanDeComponent {
  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }
}
