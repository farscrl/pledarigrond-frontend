import { Component, OnInit, inject } from '@angular/core';
import { ModificationService } from 'src/app/services/modification.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxModalComponent, NgxModalService } from "ngx-modalview";
import { MatomoTracker } from "ngx-matomo-client";

import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../models/dictionary';

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.component.html',
    styleUrls: ['./suggestion.component.scss'],
    imports: [FormsModule, TranslatePipe]
})
export class SuggestionComponent extends NgxModalComponent<null, null> implements OnInit {
  private modificationService = inject(ModificationService);
  private selectedLanguageService = inject(SelectedLanguageService);
  private authService = inject(AuthService);
  private modalService = inject(NgxModalService);
  private tracker = inject(MatomoTracker);


  deStichwort: string = '';
  rmStichwort: string = '';
  comment: string = '';
  email: string = '';

  showFormError = false;

  ngOnInit(): void {
    this.reset();
  }

  cancel() {
    this.modalService.removeAll();
  }

  reset() {
    this.deStichwort = '';
    this.rmStichwort = '';
    this.comment = '';
    this.email = this.authService.getUsername();
  }

  send() {
    this.showFormError = false;
    if (this.deStichwort === '' && this.rmStichwort === '' && this.comment === '') {
      this.showFormError = true;
      return;
    }

    const entryVersion = new EntryVersionDto();
    entryVersion.rmStichwort = this.rmStichwort;
    entryVersion.deStichwort = this.deStichwort;
    entryVersion.userComment = this.comment;
    entryVersion.userEmail = this.email;

    this.tracker.trackEvent('PROPOSTA', 'proposta ' + this.selectedLanguageService.getSelectedLanguageUrlSegment());
    this.modificationService.create(this.selectedLanguageService.getSelectedLanguageUrlSegment(), entryVersion).subscribe(data => {
      this.cancel();
    }, error => {
      console.error(error);
    })
  }
}
