import { Component, Input, OnInit } from '@angular/core';
import { PublicationStatus } from 'src/app/models/lemma-version';

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
