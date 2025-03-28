import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { LemmaVersion } from '../../../models/lemma-version';
import { RegistrationService } from '../../../services/registration.service';
import { ListFilter } from '../../../models/registration-filter';
import { Registration } from '../../../models/registration';
import { EditorService } from '../../../services/editor.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';

@Component({
    selector: 'app-pronunciation',
    templateUrl: './pronunciation.component.html',
    styleUrl: './pronunciation.component.scss',
    standalone: false
})
export class PronunciationComponent implements OnInit {

  isModifyActive = false;

  orderedRegistration: Registration | null = null;

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
    private modal: NzModalService,
  ) {
    this.lexEntryId = data.lexEntryId;
  }

  ngOnInit() {
    this.init();
  }

  didOrderRegistration() {
    this.registrationService.didOrderRegistration(this.lexEntryId).subscribe((value) => {
      this.orderedRegistration = value;
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

  getAudioUrlByRegistration(registration: Registration) {
    return this.registrationService.getMp3UrlByRegistration(registration);
  }

  getAudioUrlById(id: string) {
    return this.registrationService.getMp3UrlById(id);
  }

  handleOk() {
    this.modalRef.close(this.lemmaVersion?.lemmaValues.RPronunciation);
  }

  orderRegistration() {
    const registration = new Registration();
    registration.rmStichwort = this.lemmaVersion?.lemmaValues.RStichwort;
    registration.deStichwort = this.lemmaVersion?.lemmaValues.DStichwort;
    registration.rmGenus = this.lemmaVersion?.lemmaValues.RGenus;
    registration.rmGrammatik = this.lemmaVersion?.lemmaValues.RGrammatik;

    this.registrationService.orderRegistration(registration).subscribe(() => {
      this.init();
    });
  }

  private init() {
    this.isModifyActive = false;
    this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntryId).subscribe(entry => {
      this.lemmaVersion = entry.current;

      this.didOrderRegistration();

      this.listFilter.searchTerm = this.lemmaVersion.lemmaValues.RStichwort;
      this.searchRegistrations();
    })
  }
}
