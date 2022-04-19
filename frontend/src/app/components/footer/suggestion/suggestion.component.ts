import { Component, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { ModificationService } from 'src/app/services/modification.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { AuthService } from 'src/app/services/auth.service';
import { SimpleModalComponent, SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent extends SimpleModalComponent<null, null> implements OnInit {

  DStichwort: string = '';
  RStichwort: string = '';
  comment: string = '';
  email: string = '';

  showFormError = false;



  constructor(
    private modificationService: ModificationService,
    private selectedLanguageService: SelectedLanguageService,
    private authService: AuthService,
    private simpleModalService: SimpleModalService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.reset();
  }

  cancel() {
    this.simpleModalService.removeAll();
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
    lv.lemmaValues.RStichwort = this.RStichwort;
    lv.lemmaValues.DStichwort = this.DStichwort;
    lv.lemmaValues.user_comment = this.comment;
    lv.lemmaValues.user_email = this.email;

    this.modificationService.create(this.selectedLanguageService.getSelectedLanguageUrlSegment(), lv).subscribe(data => {
      this.cancel();
    }, error => {
      console.error(error);
    })
  }
}
