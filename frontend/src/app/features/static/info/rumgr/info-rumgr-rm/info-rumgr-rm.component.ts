import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-info-rumgr-rm',
    templateUrl: './info-rumgr-rm.component.html',
    standalone: false
})
export class InfoRumgrRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
