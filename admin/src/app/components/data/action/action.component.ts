import { Component, Input, OnInit } from '@angular/core';
import { Action } from '../../../models/dictionary';

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss'],
    standalone: false
})
export class ActionComponent implements OnInit {

  @Input()
  action?: Action;

  constructor() { }

  ngOnInit(): void {
  }

}
