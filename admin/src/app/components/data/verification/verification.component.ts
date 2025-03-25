import { Component, Input, OnInit } from '@angular/core';
import { Verification } from 'src/app/models/lemma-version';
import { EditorRole } from 'src/app/models/user';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss'],
    standalone: false
})
export class VerificationComponent implements OnInit {

  @Input()
  verification?: Verification;

  constructor() { }

  ngOnInit(): void {
  }

}
