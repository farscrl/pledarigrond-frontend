import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-sutsilv-rm',
  templateUrl: './info-sutsilv-rm.component.html'
})
export class InfoSutsilvRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
