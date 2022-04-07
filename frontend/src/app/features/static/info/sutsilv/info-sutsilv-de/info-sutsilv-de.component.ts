import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-sutsilv-de',
  templateUrl: './info-sutsilv-de.component.html'
})
export class InfoSutsilvDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
