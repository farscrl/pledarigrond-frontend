import {Component, Input} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Language} from "../../models/security";
import {LexEntry} from "../../models/lex-entry";

@Component({
  selector: 'app-diff-modal',
  templateUrl: './diff-modal.component.html',
  styleUrls: ['./diff-modal.component.scss']
})
export class DiffModalComponent {

  @Input()
  language: Language = Language.RUMANTSCHGRISCHUN;

  @Input()
  lexEntry: LexEntry = new LexEntry();

  constructor(
    private modal: NzModalRef,
  ) {
  }
}
