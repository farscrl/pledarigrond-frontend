import { Component, Input, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { SimpleModalComponent, SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-verbs-modal',
  templateUrl: './verbs-modal.component.html',
  styleUrls: ['./verbs-modal.component.scss']
})
export class VerbsModalComponent extends SimpleModalComponent<{lemmaVersion?: LemmaVersion}, null> implements OnInit {

  @Input()
  lemmaVersion?: LemmaVersion;

  constructor(private simpleModalService: SimpleModalService) {
    super();
  }

  ngOnInit(): void {
  }

  closeOverlay() {
    this.simpleModalService.removeAll();
  }
}
