import { Component, Input, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import {NgxModalComponent, NgxModalService} from "ngx-modalview";

@Component({
  selector: 'app-verbs-modal',
  templateUrl: './verbs-modal.component.html',
  styleUrls: ['./verbs-modal.component.scss']
})
export class VerbsModalComponent extends NgxModalComponent<{lemmaVersion?: LemmaVersion}, null> implements OnInit {

  @Input()
  lemmaVersion?: LemmaVersion;

  constructor(private modalService: NgxModalService) {
    super();
  }

  ngOnInit(): void {
  }

  closeOverlay() {
    this.modalService.removeAll();
  }
}
