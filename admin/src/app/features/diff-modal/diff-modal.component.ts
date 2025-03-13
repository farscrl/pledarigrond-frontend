import { Component, Inject } from '@angular/core';
import { NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { Language } from "../../models/security";
import { LanguageSelectionService } from "../../services/language-selection.service";
import { EntryVersionInternalDto } from '../../models/dictionary';

export class DiffModalData {
  oldLemmaVersion: EntryVersionInternalDto = new EntryVersionInternalDto();
  newLemmaVersion: EntryVersionInternalDto = new EntryVersionInternalDto();
}

@Component({
    selector: 'app-diff-modal',
    templateUrl: './diff-modal.component.html',
    styleUrls: ['./diff-modal.component.scss'],
    standalone: false
})
export class DiffModalComponent {

  language: Language = Language.RUMANTSCHGRISCHUN;
  oldLemmaVersion: EntryVersionInternalDto = new EntryVersionInternalDto();
  newLemmaVersion: EntryVersionInternalDto = new EntryVersionInternalDto();

  constructor(
    languageSelectionService: LanguageSelectionService,
    @Inject(NZ_MODAL_DATA) data: DiffModalData
  ) {
    this.oldLemmaVersion = data.oldLemmaVersion;
    this.newLemmaVersion = data.newLemmaVersion;
    this.language = languageSelectionService.getCurrentLanguage();
  }
}
