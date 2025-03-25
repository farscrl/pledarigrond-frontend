import { Component, Input, OnInit } from '@angular/core';
import { Status } from 'src/app/models/lemma-version';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss'],
    standalone: false
})
export class StatusComponent implements OnInit {

  @Input()
  status?: Status;

  constructor() { }

  ngOnInit(): void {
  }

}
