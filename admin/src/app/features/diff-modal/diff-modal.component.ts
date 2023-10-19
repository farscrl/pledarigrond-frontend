import { Component, Inject } from '@angular/core';
import { NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import {Language} from "../../models/security";
import {LexEntry} from "../../models/lex-entry";
import {LanguageSelectionService} from "../../services/language-selection.service";

export class DiffModalData {
  lexEntry: LexEntry = new LexEntry()
}

@Component({
  selector: 'app-diff-modal',
  templateUrl: './diff-modal.component.html',
  styleUrls: ['./diff-modal.component.scss']
})
export class DiffModalComponent {

  language: Language = Language.RUMANTSCHGRISCHUN;

  lexEntry: LexEntry;

  constructor(
    languageSelectionService: LanguageSelectionService,
    @Inject(NZ_MODAL_DATA) data: DiffModalData
  ) {
    this.lexEntry = data.lexEntry;
    this.language = languageSelectionService.getCurrentLanguage();
  }
}
