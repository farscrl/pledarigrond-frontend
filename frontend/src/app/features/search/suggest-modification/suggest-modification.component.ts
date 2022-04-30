import { Component, Input, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { ModificationService } from 'src/app/services/modification.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { AuthService } from 'src/app/services/auth.service';
import { SimpleModalComponent, SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-suggest-modification',
  templateUrl: './suggest-modification.component.html',
  styleUrls: ['./suggest-modification.component.scss']
})
export class SuggestModificationComponent extends SimpleModalComponent<{lemmaVersion: LemmaVersion}, null> implements OnInit {

  @Input()
  set lemmaVersion(lemmaVersion: LemmaVersion | undefined) {
    this.originalLemmaVersion = lemmaVersion;
    this.copy(this.originalLemmaVersion);
  }

  originalLemmaVersion?: LemmaVersion;
  changedLemmaVersion?: LemmaVersion;

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
    this.copy(this.originalLemmaVersion);
    if (this.changedLemmaVersion) {
      this.changedLemmaVersion!.lemmaValues.contact_email = this.authService.getUsername();
    }
  }

  send() {
    this.showFormError = false;
    if (this.changedLemmaVersion!.lemmaValues.DStichwort === ''
    && this.changedLemmaVersion!.lemmaValues.RStichwort === ''
    && this.changedLemmaVersion!.lemmaValues.contact_comment === '') {
      this.showFormError = true;
      return;
    }

    this.modificationService.suggestChange(this.selectedLanguageService.getSelectedLanguageUrlSegment(), this.changedLemmaVersion?.lexEntryId, this.changedLemmaVersion!).subscribe(data => {
      this.cancel();
    }, error => {
      console.error(error);
    })
  }

  private copy(lemmaVersion?: LemmaVersion) {
    if (!lemmaVersion) {
      this.changedLemmaVersion = undefined;
      return;
    }
    this.changedLemmaVersion = JSON.parse(JSON.stringify(lemmaVersion));
    this.changedLemmaVersion!.lemmaValues.contact_email = this.authService.getUsername();
  }
}
