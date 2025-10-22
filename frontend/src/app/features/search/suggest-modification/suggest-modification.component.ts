import { Component, Input, OnInit, inject } from '@angular/core';
import { ModificationService } from 'src/app/services/modification.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxModalComponent, NgxModalService } from "ngx-modalview";
import { MatomoTracker } from "ngx-matomo-client";

import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../models/dictionary';

@Component({
    selector: 'app-suggest-modification',
    templateUrl: './suggest-modification.component.html',
    styleUrls: ['./suggest-modification.component.scss'],
    imports: [FormsModule, TranslatePipe]
})
export class SuggestModificationComponent extends NgxModalComponent<{version: EntryVersionDto}, null> implements OnInit {
  private modificationService = inject(ModificationService);
  private selectedLanguageService = inject(SelectedLanguageService);
  private authService = inject(AuthService);
  private modalService = inject(NgxModalService);
  private tracker = inject(MatomoTracker);


  @Input()
  set version(version: EntryVersionDto | undefined) {
    this.originalVersion = version;
    this.copy(this.originalVersion);
  }

  originalVersion?: EntryVersionDto;
  changedVersion?: EntryVersionDto;

  showFormError = false;

  ngOnInit(): void {
    this.reset();
  }

  cancel() {
    this.modalService.removeAll();
  }

  reset() {
    this.copy(this.originalVersion);
    if (this.changedVersion) {
      this.changedVersion!.userEmail = this.authService.getUsername();
    }
  }

  send() {
    this.showFormError = false;
    if (this.changedVersion!.deStichwort === ''
    && this.changedVersion!.rmStichwort === ''
    && this.changedVersion!.userComment === '') {
      this.showFormError = true;
      return;
    }

    this.tracker.trackEvent('PROPOSTA', 'proposta ' + this.selectedLanguageService.getSelectedLanguageUrlSegment());
    this.modificationService.suggestChange(this.selectedLanguageService.getSelectedLanguageUrlSegment(), this.changedVersion!.entryId, this.changedVersion!).subscribe(data => {
      this.cancel();
    }, error => {
      console.error(error);
    })
  }

  private copy(version?: EntryVersionDto) {
    if (!version) {
      this.changedVersion = undefined;
      return;
    }
    this.changedVersion = JSON.parse(JSON.stringify(version));
    this.changedVersion!.userEmail = this.authService.getUsername();
  }
}
