import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-rumgr-de',
  templateUrl: './info-rumgr-de.component.html'
})
export class InfoRumgrDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
