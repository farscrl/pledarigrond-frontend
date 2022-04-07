import { Component, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { ModificationService } from 'src/app/services/modification.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

import * as $ from 'jquery';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent implements OnInit {

  DStichwort: string = '';
  RStichwort: string = '';
  comment: string = '';
  email: string = '';

  showFormError = false;



  constructor(
    private modificationService: ModificationService,
    private selectedLanguageService: SelectedLanguageService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const that = this;
    jQuery('#suggestionModal').on('show', function () {
      that.reset();
    });
  }

  cancel() {
    (jQuery('#suggestionModal') as any).modal('hide');
    this.reset();
  }

  reset() {
    this.DStichwort = '';
    this.RStichwort = '';
    this.comment = '';
    this.email = this.authService.getUsername();
  }

  send() {
    this.showFormError = false;
    if (this.DStichwort === '' && this.RStichwort === '' && this.comment === '') {
      this.showFormError = true;
      return;
    }

    const lv = new LemmaVersion();
    lv.entryValues.RStichwort = this.RStichwort;
    lv.entryValues.DStichwort = this.DStichwort;
    lv.entryValues.maalr_comment = this.comment;
    lv.entryValues.maalr_email = this.email;

    this.modificationService.create(this.selectedLanguageService.getSelectedLanguageUrlSegment(), lv).subscribe(data => {
      this.cancel();
    }, error => {
      console.error(error);
    })
  }
}
