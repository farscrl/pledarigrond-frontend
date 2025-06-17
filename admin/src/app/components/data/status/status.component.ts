import { Component, Input, OnInit } from '@angular/core';
import { PublicationStatus } from '../../../models/dictionary';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss'],
    standalone: false
})
export class StatusComponent implements OnInit {

  @Input()
  status?: PublicationStatus;

  constructor() { }

  ngOnInit(): void {
  }

}
