import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { RegistrationService } from '../../../services/registration.service';
import { ListFilter } from '../../../models/registration-filter';
import { Registration } from '../../../models/registration';
import { EditorService } from '../../../services/editor.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';
import { EntryVersionInternalDto } from '../../../models/dictionary';
import { NgIf, NgFor } from '@angular/common';
import { RegistrationStatusComponent } from '../../../components/data/registration-status/registration-status.component';
import { AudioPlayerComponent } from '../../../components/audio-player/audio-player.component';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzInputGroupComponent, NzInputDirective } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzTbodyComponent } from 'ng-zorro-antd/table';

@Component({
    selector: 'app-pronunciation',
    templateUrl: './pronunciation.component.html',
    styleUrl: './pronunciation.component.scss',
    imports: [NgIf, RegistrationStatusComponent, AudioPlayerComponent, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, NzDividerComponent, NzFlexDirective, NzInputGroupComponent, NzInputDirective, FormsModule, NzIconDirective, NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzTbodyComponent, NgFor, NzModalFooterDirective]
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
    registration.lemmaIds = [this.entryId];

    this.registrationService.orderRegistration(registration).subscribe(() => {
      this.init();
    });
  }

  removeRegistration() {
    if (!this.entryVersion?.rmPronunciation) {
      return;
    }

    this.modal.confirm({
      nzTitle: 'Vuls ti propi allontanar la pronunzia?',
      nzOkText: 'Allontanar',
      nzCancelText: 'Interrumper',
      nzOnOk: () => {
        this.registrationService.removeRegistrationFromLemma(this.entryId).subscribe(() => {
          this.init();
        });
      }
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
