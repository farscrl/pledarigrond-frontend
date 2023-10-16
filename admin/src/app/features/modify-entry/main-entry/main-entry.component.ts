import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntry } from 'src/app/models/lex-entry';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConjugationComponent } from '../conjugation/conjugation.component';
import { TranslateService } from '@ngx-translate/core';
import { NounGenerationComponent } from '../noun-generation/noun-generation.component';
import { AdjectiveGenerationComponent } from '../adjective-generation/adjective-generation.component';
import { Language } from "../../../models/security";
import { PronounGenerationComponent } from "../pronoun-generation/pronoun-generation.component";
import { EnvironmentService } from "../../../services/environment.service";
import { OtherGenerationComponent } from '../other-generation/other-generation.component';

@Component({
  selector: 'app-main-entry',
  templateUrl: './main-entry.component.html',
  styleUrls: ['./main-entry.component.scss']
})
export class MainEntryComponent implements OnInit {

  @Input()
  lexEntryId?: string;

  @Input()
  directlyLoadDetailView = false;

  isLoading = false;

  private grammarValues: string[] = [];
  private genderValues: string[] = [];

  categoryAutocomplete: string[] = [];
  rSemanticsAutocomplete: string[] = [];
  dSemanticsAutocomplete: string[] = [];
  rGrammarAutocompleteValues: string[] = [];
  dGrammarAutocompleteValues: string[] = [];
  rGenderAutocompleteValues: string[] = [];
  dGenderAutocompleteValues: string[] = [];

  private lexEntry?: LexEntry;
  private lemmaVersion?: LemmaVersion;

  validateForm!: UntypedFormGroup;

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private editorService: EditorService,
    public languageSelectionService: LanguageSelectionService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService,
    public environmentService: EnvironmentService,
  ) { }

  ngOnInit(): void {
    this.reset();
    this.editorService.getChoiceFieldsSuggestions(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.genderValues = data.gender;
      this.grammarValues = data.grammar;
      this.setupDropdownValues();
    });
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.lemmaVersion = new LemmaVersion();
    this.setUpForm();

    if (this.lexEntryId) {
      this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntryId).subscribe(entry => {
        this.lexEntry = entry;
        this.lemmaVersion = JSON.parse(JSON.stringify(entry.mostRecent));
        this.setUpForm();
      });
    }
  }

  save(asSuggestion: boolean) {
    if (this.validateForm.valid) {
      if (!!this.lexEntryId) {
        this.updateEntry(asSuggestion);
      } else {
        this.saveNewEntry(asSuggestion);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  doesSupportVerb(language: Language): boolean {
    return true;
  }

  editVerb() {
    this.lemmaVersion!.lemmaValues.RStichwort = this.validateForm.controls['RStichwort'].value;
    this.lemmaVersion!.lemmaValues.RGenus = this.validateForm.controls['RGenus'].value;
    this.lemmaVersion!.lemmaValues.RFlex = this.validateForm.controls['RFlex'].value;
    if (!this.lemmaVersion?.lemmaValues.infinitiv || this.lemmaVersion?.lemmaValues.infinitiv === "") {
      this.lemmaVersion!.lemmaValues.infinitiv = this.lemmaVersion?.lemmaValues.RStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.conjugation.title'),
      nzContent: ConjugationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    })
  }

  editNoun() {
    this.lemmaVersion!.lemmaValues.RStichwort = this.validateForm.controls['RStichwort'].value;
    this.lemmaVersion!.lemmaValues.RGenus = this.validateForm.controls['RGenus'].value;
    this.lemmaVersion!.lemmaValues.RFlex = this.validateForm.controls['RFlex'].value;

    if (!this.lemmaVersion?.lemmaValues.baseForm || this.lemmaVersion?.lemmaValues.baseForm === "") {
      this.lemmaVersion!.lemmaValues.baseForm = this.lemmaVersion?.lemmaValues.RStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.noun.title'),
      nzContent: NounGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    });
  }

  editAdjective() {
    this.lemmaVersion!.lemmaValues.RStichwort = this.validateForm.controls['RStichwort'].value;
    this.lemmaVersion!.lemmaValues.RGenus = this.validateForm.controls['RGenus'].value;
    this.lemmaVersion!.lemmaValues.RFlex = this.validateForm.controls['RFlex'].value;

    if (!this.lemmaVersion?.lemmaValues.baseForm || this.lemmaVersion?.lemmaValues.baseForm === "") {
      this.lemmaVersion!.lemmaValues.baseForm = this.lemmaVersion?.lemmaValues.RStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.adjective.title'),
      nzContent: AdjectiveGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    });
  }

  editPronoun() {
    this.lemmaVersion!.lemmaValues.RStichwort = this.validateForm.controls['RStichwort'].value;
    this.lemmaVersion!.lemmaValues.RGenus = this.validateForm.controls['RGenus'].value;
    this.lemmaVersion!.lemmaValues.RFlex = this.validateForm.controls['RFlex'].value;

    if (!this.lemmaVersion?.lemmaValues.baseForm || this.lemmaVersion?.lemmaValues.baseForm === "") {
      this.lemmaVersion!.lemmaValues.baseForm = this.lemmaVersion?.lemmaValues.RStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.pronoun.title'),
      nzContent: PronounGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    });
  }

  editOther() {
    this.lemmaVersion!.lemmaValues.RStichwort = this.validateForm.controls['RStichwort'].value;
    this.lemmaVersion!.lemmaValues.RGenus = this.validateForm.controls['RGenus'].value;
    this.lemmaVersion!.lemmaValues.RFlex = this.validateForm.controls['RFlex'].value;

    if (!this.lemmaVersion?.lemmaValues.baseForm || this.lemmaVersion?.lemmaValues.baseForm === "") {
      this.lemmaVersion!.lemmaValues.baseForm = this.lemmaVersion?.lemmaValues.RStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.other.title'),
      nzContent: OtherGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    });
  }

  replyComment() {
    const r = this.translateService.instant('reply.romansh') + " = " + (this.lemmaVersion?.lemmaValues.RStichwort || "");
    const d = this.translateService.instant('reply.german') + " = " + (this.lemmaVersion?.lemmaValues.DStichwort || "");
    const remartga = this.translateService.instant('reply.comment') + "\n" + (this.lemmaVersion?.lemmaValues.contact_comment || "");

    window.location.assign(
      "mailto:" +
      (this.lemmaVersion?.lemmaValues.contact_email || "") +
      "?subject=" +
      this.translateService.instant('reply.subject') +
      "&cc=pg@rumantsch.ch&body=" +
      encodeURIComponent(r + '\n' + d + "\n\n" + remartga));
  }

  categoryChanged() {
    const value = this.validateForm.controls['categories'].value;
    if (value === "") {
      this.categoryAutocomplete = [];
      return;
    }

    this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'categories', value).subscribe(data => {
      this.categoryAutocomplete = data;
    });
  }

  rSemanticsChanged() {
    const value = this.validateForm.controls['RSubsemantik'].value;
    if (value === "") {
      this.rSemanticsAutocomplete = [];
      return;
    }

    this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'RSubsemantik', value).subscribe(data => {
      this.rSemanticsAutocomplete = data;
    });
  }

  dSemanticsChanged() {
    const value = this.validateForm.controls['DSubsemantik'].value;
    if (value === "") {
      this.dSemanticsAutocomplete = [];
      return;
    }

    this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'DSubsemantik', value).subscribe(data => {
      this.dSemanticsAutocomplete = data;
    });
  }

  rGrammarAutocompleteChanged(searchValue?: string) {
    if (!searchValue) {
      this.rGrammarAutocompleteValues = [...this.grammarValues];
      return;
    }
    this.rGrammarAutocompleteValues = this.grammarValues.filter(option => option.indexOf(searchValue) !== -1);
  }

  dGrammarAutocompleteChanged(searchValue?: string) {
    if (!searchValue) {
      this.dGrammarAutocompleteValues = [...this.grammarValues];
      return;
    }
    this.dGrammarAutocompleteValues = this.grammarValues.filter(option => option.indexOf(searchValue) !== -1);
  }

  rGenderAutocompleteChanged(searchValue?: string) {
    if (!searchValue) {
      this.rGenderAutocompleteValues = [...this.genderValues];
      return;
    }
    this.rGenderAutocompleteValues = this.genderValues.filter(option => option.indexOf(searchValue) !== -1);
  }

  dGenderAutocompleteChanged(searchValue?: string) {
    if (!searchValue) {
      this.dGenderAutocompleteValues = [...this.genderValues];
      return;
    }
    this.dGenderAutocompleteValues = this.genderValues.filter(option => option.indexOf(searchValue) !== -1);
  }

  private setUpForm() {
    this.setupDropdownValues();

    this.validateForm = this.fb.group({
      DStichwort: new UntypedFormControl(this.lemmaVersion?.lemmaValues.DStichwort, Validators.required),
      DGrammatik: new UntypedFormControl(this.lemmaVersion?.lemmaValues.DGrammatik),
      DSubsemantik: new UntypedFormControl(this.lemmaVersion?.lemmaValues.DSubsemantik),
      DGenus: new UntypedFormControl(this.lemmaVersion?.lemmaValues.DGenus),
      DTags: new UntypedFormControl(this.lemmaVersion?.lemmaValues.DTags),

      RStichwort: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RStichwort, Validators.required),
      RGrammatik: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RGrammatik),
      RSubsemantik: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RSubsemantik),
      RGenus: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RGenus),
      RFlex: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RFlex),
      RTags: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RTags),
      RInflectionType: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RInflectionType),

      DRedirect: new UntypedFormControl(this.lemmaVersion?.lemmaValues.DRedirect),
      RRedirect: new UntypedFormControl(this.lemmaVersion?.lemmaValues.RRedirect),
      categories: new UntypedFormControl(this.lemmaVersion?.lemmaValues.categories),
      REtymologie: new UntypedFormControl(this.lemmaVersion?.lemmaValues.REtymologie),

      contact_comment: new UntypedFormControl(this.lemmaVersion?.lemmaValues.contact_comment),
      contact_email: new UntypedFormControl(this.lemmaVersion?.lemmaValues.contact_email),
    });

    if (this.directlyLoadDetailView) {
      if (this.validateForm.controls['RInflectionType'].value === 'V') {
        this.editVerb();
        this.directlyLoadDetailView = false;
      } else if (this.validateForm.controls['RInflectionType'].value === 'NOUN') {
        this.editNoun();
        this.directlyLoadDetailView = false;
      } else if (this.validateForm.controls['RInflectionType'].value === 'ADJECTIVE') {
        this.editAdjective();
        this.directlyLoadDetailView = false;
      }
    }
  }

  private setupDropdownValues() {
    if (this.lemmaVersion?.lemmaValues.DGrammatik && !this.grammarValues.includes(this.lemmaVersion?.lemmaValues.DGrammatik)) {
      this.grammarValues.push(this.lemmaVersion?.lemmaValues.DGrammatik);
    }
    if (this.lemmaVersion?.lemmaValues.RGrammatik && !this.grammarValues.includes(this.lemmaVersion?.lemmaValues.RGrammatik)) {
      this.grammarValues.push(this.lemmaVersion?.lemmaValues.RGrammatik);
    }

    if (this.lemmaVersion?.lemmaValues.DGenus && !this.genderValues.includes(this.lemmaVersion?.lemmaValues.DGenus)) {
      this.genderValues.push(this.lemmaVersion?.lemmaValues.DGenus);
    }
    if (this.lemmaVersion?.lemmaValues.RGenus && !this.genderValues.includes(this.lemmaVersion?.lemmaValues.RGenus)) {
      this.genderValues.push(this.lemmaVersion?.lemmaValues.RGenus);
    }

    this.rGrammarAutocompleteChanged(this.lemmaVersion?.lemmaValues.RGrammatik);
    this.dGrammarAutocompleteChanged(this.lemmaVersion?.lemmaValues.DGrammatik);
    this.rGenderAutocompleteChanged(this.lemmaVersion?.lemmaValues.RGenus);
    this.dGenderAutocompleteChanged(this.lemmaVersion?.lemmaValues.DGenus);
  }

  private saveNewEntry(asSuggestion: boolean) {
    const lexEntry = new LexEntry();
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lexEntryId = this.lemmaVersion?.lexEntryId;
    lemmaVersion.lemmaValues = {
      ...this.lemmaVersion?.lemmaValues,
      ...JSON.parse(JSON.stringify(this.validateForm.value)),
    };
    lexEntry.versionHistory.push(lemmaVersion);
    lexEntry.current = lemmaVersion;
    lexEntry.mostRecent = lemmaVersion;

    this.editorService.newLexEntry(this.languageSelectionService.getCurrentLanguage(), lexEntry, asSuggestion).subscribe(data => {
      this.modal.triggerOk();
      this.cancel();
    }, error => {
      console.error(error);
    });
  }

  private updateEntry(asSuggestion: boolean) {
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lexEntryId = this.lemmaVersion?.lexEntryId;
    lemmaVersion.lemmaValues = {
      ...this.lemmaVersion?.lemmaValues,
      ...JSON.parse(JSON.stringify(this.validateForm.value)),
    };
    if (asSuggestion) {
      this.editorService.modifyLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntry!.id!, lemmaVersion).subscribe(data => {
        this.modal.triggerOk();
        this.cancel();
      }, error => {
        console.error(error);
      });
    } else {
      this.editorService.modifyAndAccepptLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntry!.id!, lemmaVersion).subscribe(data => {
        this.modal.triggerOk();
        this.cancel();
      }, error => {
        console.error(error);
      });
    }
  }
}
