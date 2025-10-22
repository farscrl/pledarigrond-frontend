import { Component, Input, OnInit } from '@angular/core';
import { Action } from '../../../models/dictionary';

import { NzTagComponent } from 'ng-zorro-antd/tag';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss'],
    imports: [NzTagComponent, TranslatePipe]
})
export class ActionComponent implements OnInit {

  @Input()
  action?: Action;

  constructor() { }

  ngOnInit(): void {
  }

}
