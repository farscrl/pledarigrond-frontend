import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-surmiran-de',
  templateUrl: './info-surmiran-de.component.html'
})
export class InfoSurmiranDeComponent implements OnInit {

  @Input()
  nbrEntries?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
