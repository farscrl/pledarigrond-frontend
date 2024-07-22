import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { LemmaVersion } from '../../../models/lemma-version';
import { RegistrationService } from '../../../services/registration.service';
import { ListFilter } from '../../../models/registration-filter';
import { Registration } from '../../../models/registration';
import { EditorService } from '../../../services/editor.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';

@Component({
  selector: 'app-pronunciation',
  templateUrl: './pronunciation.component.html',
  styleUrl: './pronunciation.component.scss'
})
export class PronunciationComponent implements OnInit {

  isModifyActive = false;

  isOrderActive = false;

  lexEntryId: string;
  lemmaVersion?: LemmaVersion;
  listFilter = new ListFilter();

  searchResults: Registration[] = [];

  constructor(
    @Inject(NZ_MODAL_DATA) data: {lexEntryId: string},
    private registrationService: RegistrationService,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private modalRef: NzModalRef,
  ) {
    this.lexEntryId = data.lexEntryId;
  }

  ngOnInit() {
    this.init();
  }

  didOrderRegistration() {
    this.registrationService.didOrderRegistration(this.lexEntryId).subscribe((value) => {
      this.isOrderActive = value;
    });

  }

  searchRegistrations() {
    this.registrationService.getRegistrations(this.listFilter, 0, 30).subscribe(page => {
      this.searchResults = page.content;
    });
  }

  addPronunciation(registration: Registration) {
    this.modal.confirm({
      nzTitle: 'Vuls ti propi attribuir la pronunzia (' + registration.rmStichwort + ') a quest lemma?',
      nzOkText: 'Attribuir',
      nzCancelText: 'Interrumper',
      nzOnOk: () => {
        this.registrationService.addRegistrationToLemma(registration, this.lexEntryId).subscribe(() => {
          this.init();
        });
      }
    });
  }
  }

  getAudioUrl(registration: Registration) {
    return this.registrationService.getMp3Url(registration);
  }

  handleOk() {
    this.modalRef.close(this.lemmaVersion?.lemmaValues.RPronunciation);
  }

  private init() {
    this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntryId).subscribe(entry => {
      this.lemmaVersion = entry.current;

      this.didOrderRegistration();

      this.listFilter.searchTerm = this.lemmaVersion.lemmaValues.RStichwort;
      this.searchRegistrations();
    })
  }
}
