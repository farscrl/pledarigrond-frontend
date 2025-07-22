import { Component, OnInit } from '@angular/core';
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

  deStichwort: string = '';
  rmStichwort: string = '';
  comment: string = '';
  email: string = '';

  showFormError = false;



  constructor(
    private modificationService: ModificationService,
    private selectedLanguageService: SelectedLanguageService,
    private authService: AuthService,
    private modalService: NgxModalService,
    private tracker: MatomoTracker,
  ) {
    super();
  }

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
