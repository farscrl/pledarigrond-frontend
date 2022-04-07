import { Component, Input, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';

@Component({
  selector: 'app-verbs-modal',
  templateUrl: './verbs-modal.component.html',
  styleUrls: ['./verbs-modal.component.scss']
})
export class VerbsModalComponent implements OnInit {

  @Input()
  lemmaVersion?: LemmaVersion;

  constructor() { }

  ngOnInit(): void {
  }

}
