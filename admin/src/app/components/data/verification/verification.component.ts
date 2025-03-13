import { Component, Input, OnInit } from '@angular/core';
import { VersionStatus } from '../../../models/dictionary';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss'],
    standalone: false
})
export class VerificationComponent implements OnInit {

  @Input()
  verification?: VersionStatus;

  constructor() { }

  ngOnInit(): void {
  }

}
