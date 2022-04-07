import { Component, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { ModificationService } from 'src/app/services/modification.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

import * as $ from 'jquery';

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



  constructor(private modificationService: ModificationService, private selectedLanguageService: SelectedLanguageService) { }

  ngOnInit(): void {
    this.reset();
  }

  cancel() {

  }

  reset() {
    this.DStichwort = '';
    this.RStichwort = '';
    this.comment = '';
    this.email = '';
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
      this.reset();
      (jQuery('#suggestionModal') as any).modal('hide')
    }, error => {
      console.error();
    })
  }
}
