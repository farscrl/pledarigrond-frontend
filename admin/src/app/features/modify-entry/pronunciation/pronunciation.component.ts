import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { RegistrationService } from '../../../services/registration.service';
import { ListFilter } from '../../../models/registration-filter';
import { Registration } from '../../../models/registration';
import { EditorService } from '../../../services/editor.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';
import { EntryVersionInternalDto } from '../../../models/dictionary';

@Component({
    selector: 'app-pronunciation',
    templateUrl: './pronunciation.component.html',
    styleUrl: './pronunciation.component.scss',
    standalone: false
})
export class PronunciationComponent implements OnInit {

  isModifyActive = false;

  orderedRegistration: Registration | null = null;

  entryId: string;
  entryVersion?: EntryVersionInternalDto;
  listFilter = new ListFilter();

  searchResults: Registration[] = [];

  constructor(
    @Inject(NZ_MODAL_DATA) data: {entryId: string},
    private registrationService: RegistrationService,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private modalRef: NzModalRef,
    private modal: NzModalService,
  ) {
    this.entryId = data.entryId;
  }

  ngOnInit() {
    this.init();
  }

  didOrderRegistration() {
    this.registrationService.didOrderRegistration(this.entryId).subscribe((value) => {
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
        this.registrationService.addRegistrationToLemma(registration, this.entryId).subscribe(() => {
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
    this.modalRef.close(this.entryVersion?.rmPronunciation);
  }

  orderRegistration() {
    const registration = new Registration();
    registration.rmStichwort = this.entryVersion?.rmStichwort;
    registration.deStichwort = this.entryVersion?.deStichwort;
    registration.rmGenus = this.entryVersion?.rmGenus;
    registration.rmGrammatik = this.entryVersion?.rmGrammatik;

    this.registrationService.orderRegistration(registration).subscribe(() => {
      this.init();
    });
  }

  private init() {
    this.isModifyActive = false;
    this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), this.entryId).subscribe(entry => {
      this.entryVersion = entry.current;

      this.didOrderRegistration();

      this.listFilter.searchTerm = this.entryVersion?.rmStichwort;
      this.searchRegistrations();
    })
  }
}
