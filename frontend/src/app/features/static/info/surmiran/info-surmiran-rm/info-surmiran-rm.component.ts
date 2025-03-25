import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-info-surmiran-rm',
    templateUrl: './info-surmiran-rm.component.html',
    standalone: false
})
export class InfoSurmiranRmComponent implements OnInit {

  @Input()
  nbrEntries?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
