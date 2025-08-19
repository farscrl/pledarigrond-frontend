import { Component, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { TranslateService } from '@ngx-translate/core';
import { NounGenerationComponent } from '../noun-generation/noun-generation.component';
import { AdjectiveGenerationComponent } from '../adjective-generation/adjective-generation.component';
import { PronounGenerationComponent } from "../pronoun-generation/pronoun-generation.component";
import { EnvironmentService } from "../../../services/environment.service";
import { OtherGenerationComponent } from '../other-generation/other-generation.component';
import { PronunciationComponent } from '../pronunciation/pronunciation.component';
import { RegistrationService } from '../../../services/registration.service';
import { FindCorpusEntryComponent } from '../find-corpus-entry/find-corpus-entry.component';
import {
  Adjective,
  EntryVersionInternalDto,
  Example,
  Inflection,
  Noun,
  Other,
  Pronoun,
  Verb
} from '../../../models/dictionary';
import { ConjugationComponent } from '../conjugation/conjugation.component';

export class MainEntryData {
  entryIdToChange?: string;
  entryVersionToChange?: EntryVersionInternalDto;
  directlyLoadDetailView = false;
  replaceSuggestion = false;
  isAutomaticChange = false;
}

@Component({
    selector: 'app-main-entry',
    templateUrl: './main-entry.component.html',
    styleUrls: ['./main-entry.component.scss'],
    standalone: false
})
export class MainEntryComponent implements OnInit {
  entryIdToChange?: string;
  entryVersionToChange?: EntryVersionInternalDto;
  directlyLoadDetailView;
  replaceSuggestion;
  isAutomaticChange: boolean = false;

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

  public entryVersion: EntryVersionInternalDto = new EntryVersionInternalDto();

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
    @Inject(NZ_MODAL_DATA) data: MainEntryData,
    private registrationService: RegistrationService,
  ) {
    this.entryIdToChange = data.entryIdToChange;
    this.entryVersionToChange = data.entryVersionToChange;
    this.directlyLoadDetailView = data.directlyLoadDetailView;
    this.replaceSuggestion = data.replaceSuggestion;
    this.isAutomaticChange = data.isAutomaticChange;
  }

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
    this.entryVersion = new EntryVersionInternalDto();
    this.setUpForm();

    if (this.entryVersionToChange) {
      this.entryVersion = JSON.parse(JSON.stringify(this.entryVersionToChange));
      this.setUpForm();
    }
  }

  save(asSuggestion: boolean) {
    if (this.validateForm.valid) {
      if (!!this.entryVersion.entryId) {
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

  editVerb() {
    this.entryVersion.rmStichwort = this.validateForm.controls['rmStichwort'].value;
    this.entryVersion.rmGenus = this.validateForm.controls['rmGenus'].value;
    this.entryVersion.rmFlex = this.validateForm.controls['rmFlex'].value;
    if (!this.entryVersion.inflection) {
      this.entryVersion.inflection = new Inflection();
      this.entryVersion.inflection.inflectionType = "VERB";
    }
    if (!this.entryVersion.inflection.verb) {
      this.entryVersion.inflection.verb = new Verb();
    }
    if (!this.entryVersion.inflection.verb.infinitiv || this.entryVersion.inflection.verb.infinitiv === "") {
      this.entryVersion.inflection.verb.infinitiv = this.entryVersion.rmStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.conjugation.title'),
      nzContent: ConjugationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        version: this.entryVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.entryVersion.inflection!.verb = value;
    })
  }

  editNoun() {
    this.entryVersion.rmStichwort = this.validateForm.controls['rmStichwort'].value;
    this.entryVersion.rmGenus = this.validateForm.controls['rmGenus'].value;
    this.entryVersion.rmFlex = this.validateForm.controls['rmFlex'].value;
    if (!this.entryVersion.inflection) {
      this.entryVersion.inflection = new Inflection();
      this.entryVersion.inflection.inflectionType = "NOUN";
    }
    if (!this.entryVersion.inflection.noun) {
      this.entryVersion.inflection.noun = new Noun();
    }

    if (!this.entryVersion.inflection.noun.baseForm || this.entryVersion.inflection.noun.baseForm === "") {
      this.entryVersion.inflection.noun.baseForm = this.entryVersion.rmStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.noun.title'),
      nzContent: NounGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        version: this.entryVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.entryVersion.inflection!.noun = value;
    });
  }

  editAdjective() {
    this.entryVersion.rmStichwort = this.validateForm.controls['rmStichwort'].value;
    this.entryVersion.rmGenus = this.validateForm.controls['rmGenus'].value;
    this.entryVersion.rmFlex = this.validateForm.controls['rmFlex'].value;
    if (!this.entryVersion.inflection) {
      this.entryVersion.inflection = new Inflection();
      this.entryVersion.inflection.inflectionType = "ADJECTIVE";
    }
    if (!this.entryVersion.inflection.adjective) {
      this.entryVersion.inflection.adjective = new Adjective();
    }

    if (!this.entryVersion.inflection.adjective.baseForm || this.entryVersion.inflection.adjective.baseForm === "") {
      this.entryVersion.inflection.adjective.baseForm = this.entryVersion.rmStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.adjective.title'),
      nzContent: AdjectiveGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        version: this.entryVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.entryVersion.inflection!.adjective = value;
    });
  }

  editPronoun() {
    this.entryVersion.rmStichwort = this.validateForm.controls['rmStichwort'].value;
    this.entryVersion.rmGenus = this.validateForm.controls['rmGenus'].value;
    this.entryVersion.rmFlex = this.validateForm.controls['rmFlex'].value;
    if (!this.entryVersion.inflection) {
      this.entryVersion.inflection = new Inflection();
      this.entryVersion.inflection.inflectionType = "PRONOUN";
    }
    if (!this.entryVersion.inflection.pronoun) {
      this.entryVersion.inflection.pronoun = new Pronoun();
    }

    if (!this.entryVersion.inflection.pronoun.baseForm || this.entryVersion.inflection.pronoun.baseForm === "") {
      this.entryVersion.inflection.pronoun.baseForm = this.entryVersion.rmStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.pronoun.title'),
      nzContent: PronounGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        version: this.entryVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.entryVersion.inflection!.pronoun = value;
    });
  }

  editOther() {
    this.entryVersion.rmStichwort = this.validateForm.controls['rmStichwort'].value;
    this.entryVersion.rmGenus = this.validateForm.controls['rmGenus'].value;
    this.entryVersion.rmFlex = this.validateForm.controls['rmFlex'].value;
    if (!this.entryVersion.inflection) {
      this.entryVersion.inflection = new Inflection();
      this.entryVersion.inflection.inflectionType = "OTHER";
    }
    if (!this.entryVersion.inflection.other) {
      this.entryVersion.inflection.other = new Other();
    }

    if (!this.entryVersion.inflection.other.baseForm || this.entryVersion.inflection.other.baseForm === "") {
      this.entryVersion.inflection.other.baseForm = this.entryVersion.rmStichwort;
    }

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.other.title'),
      nzContent: OtherGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        version: this.entryVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.entryVersion.inflection!.other = value;
    });
  }

  editPronunciation() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.pronunciation.title'),
      nzContent: PronunciationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        entryId: this.entryVersion.entryId,
      },
    });
    modal.afterClose.subscribe((rPronunciation: string | undefined) => {
      this.entryVersion.rmPronunciation = rPronunciation;
    })
  }

  replyComment() {
    const r = this.translateService.instant('reply.romansh') + " = " + (this.entryVersion.rmStichwort || "");
    const d = this.translateService.instant('reply.german') + " = " + (this.entryVersion.deStichwort || "");
    const remartga = this.translateService.instant('reply.comment') + "\n" + (this.entryVersion.userComment || "");

    window.location.assign(
      "mailto:" +
      (this.entryVersion.userEmail || "") +
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
    const value = this.validateForm.controls['rmSubsemantik'].value;
    if (value === "") {
      this.rSemanticsAutocomplete = [];
      return;
    }

    this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'rmSubsemantik', value).subscribe(data => {
      this.rSemanticsAutocomplete = data;
    });
  }

  dSemanticsChanged() {
    const value = this.validateForm.controls['deSubsemantik'].value;
    if (value === "") {
      this.dSemanticsAutocomplete = [];
      return;
    }

    this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'deSubsemantik', value).subscribe(data => {
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

  getAudioUrlById(pronunciation: string) {
    return this.registrationService.getMp3UrlById(pronunciation);
  }

  private setUpForm() {
    this.setupDropdownValues();

    this.validateForm = this.fb.group({
      deStichwort: new UntypedFormControl(this.entryVersion.deStichwort, Validators.required),
      deGrammatik: new UntypedFormControl(this.entryVersion.deGrammatik),
      deSubsemantik: new UntypedFormControl(this.entryVersion.deSubsemantik),
      deGenus: new UntypedFormControl(this.entryVersion.deGenus),
      deTags: new UntypedFormControl(this.entryVersion.deTags),

      rmStichwort: new UntypedFormControl(this.entryVersion.rmStichwort, Validators.required),
      rmGrammatik: new UntypedFormControl(this.entryVersion.rmGrammatik),
      rmSubsemantik: new UntypedFormControl(this.entryVersion.rmSubsemantik),
      rmGenus: new UntypedFormControl(this.entryVersion.rmGenus),
      rmFlex: new UntypedFormControl(this.entryVersion.rmFlex),
      rmTags: new UntypedFormControl(this.entryVersion.rmTags),
      inflectionType: new UntypedFormControl(this.entryVersion.inflection?.inflectionType),

      deRedirect: new UntypedFormControl(this.entryVersion.deRedirect),
      rmRedirect: new UntypedFormControl(this.entryVersion.rmRedirect),
      categories: new UntypedFormControl(this.entryVersion.categories),
      rmEtymologie: new UntypedFormControl(this.entryVersion.rmEtymologie),

      userComment: new UntypedFormControl(this.entryVersion.userComment),
      userEmail: new UntypedFormControl(this.entryVersion.userEmail),

      examples: this.fb.array([]),
    });

    this.loadExamples(this.entryVersion.examples);

    if (this.directlyLoadDetailView) {
      if (this.validateForm.controls['inflectionType'].value === 'VERB') {
        this.editVerb();
        this.directlyLoadDetailView = false;
      } else if (this.validateForm.controls['inflectionType'].value === 'NOUN') {
        this.editNoun();
        this.directlyLoadDetailView = false;
      } else if (this.validateForm.controls['inflectionType'].value === 'ADJECTIVE') {
        this.editAdjective();
        this.directlyLoadDetailView = false;
      }
    }
  }

  private setupDropdownValues() {
    if (this.entryVersion.deGrammatik && !this.grammarValues.includes(this.entryVersion.deGrammatik)) {
      this.grammarValues.push(this.entryVersion.deGrammatik);
    }
    if (this.entryVersion.rmGrammatik && !this.grammarValues.includes(this.entryVersion.rmGrammatik)) {
      this.grammarValues.push(this.entryVersion.rmGrammatik);
    }

    if (this.entryVersion.deGenus && !this.genderValues.includes(this.entryVersion.deGenus)) {
      this.genderValues.push(this.entryVersion.deGenus);
    }
    if (this.entryVersion.rmGenus && !this.genderValues.includes(this.entryVersion.rmGenus)) {
      this.genderValues.push(this.entryVersion.rmGenus);
    }

    this.rGrammarAutocompleteChanged(this.entryVersion.rmGrammatik);
    this.dGrammarAutocompleteChanged(this.entryVersion.deGrammatik);
    this.rGenderAutocompleteChanged(this.entryVersion.rmGenus);
    this.dGenderAutocompleteChanged(this.entryVersion.deGenus);
  }

  private saveNewEntry(asSuggestion: boolean) {
    let entryVersion = {
      ...this.entryVersion,
      ...JSON.parse(JSON.stringify(this.validateForm.value)),
    };
    entryVersion.examples = this.joinExampleStrings();

    this.editorService.newEntry(this.languageSelectionService.getCurrentLanguage(), entryVersion, asSuggestion).subscribe(data => {
      this.modal.triggerOk();
      this.cancel();
    }, error => {
      console.error(error);
    });
  }

  private updateEntry(asSuggestion: boolean) {
    let entryVersion = new EntryVersionInternalDto();
    entryVersion.entryId = this.entryVersion.entryId;
    entryVersion = {
      ...this.entryVersion,
      ...JSON.parse(JSON.stringify(this.validateForm.value)),
    };
    entryVersion.examples = this.joinExampleStrings();

    // set automatic change flag
    entryVersion.automaticChange = this.isAutomaticChange;

    if (this.replaceSuggestion && this.entryVersionToChange) {
      if (asSuggestion) {
        this.editorService.replaceSuggestionWithSuggestion(this.languageSelectionService.getCurrentLanguage(), this.entryVersion.entryId, this.entryVersionToChange.versionId, entryVersion).subscribe(data => {
          this.modal.triggerOk();
          this.cancel();
        }, error => {
          console.error(error);
        });
      } else {
        this.editorService.replaceSuggestionAndAccept(this.languageSelectionService.getCurrentLanguage(), this.entryVersion.entryId, this.entryVersionToChange.versionId, entryVersion).subscribe(data => {
          this.modal.triggerOk();
          this.cancel();
        }, error => {
          console.error(error);
        });
      }
    } else {
      if (asSuggestion) {
        this.editorService.modifyEntryVersion(this.languageSelectionService.getCurrentLanguage(), this.entryVersion.entryId, entryVersion).subscribe(data => {
          this.modal.triggerOk();
          this.cancel();
        }, error => {
          console.error(error);
        });
      } else {
        this.editorService.modifyAndAcceptEntryVersion(this.languageSelectionService.getCurrentLanguage(), this.entryVersion.entryId, entryVersion).subscribe(data => {
          this.modal.triggerOk();
          this.cancel();
        }, error => {
          console.error(error);
        });
      }
    }
  }

  get exampleControls(): FormArray {
    return this.validateForm.get('examples') as FormArray;
  }

  addExample(example?: Example): void {
    if (!example) {
      example = new Example();
    }
    this.exampleControls.push(this.fb.group({
      exampleRm: example.rm,
      exampleDe: example.de
    }));
  }

  removeExample(index: number): void {
    this.exampleControls.removeAt(index);
  }

  searchExamples(index: number) {
    const searchTerm = this.validateForm.value.rmStichwort;

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.corpus.title'),
      nzContent: FindCorpusEntryComponent,
      nzClosable: true,
      nzMaskClosable: true,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzData: {
        searchTerm,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }

      this.exampleControls.at(index).get('exampleRm')!.setValue(value);
    })
  }

  private loadExamples(examples: Example[] = []): void {
    examples.forEach(example => this.addExample(example));
  }

  joinExampleString(group: UntypedFormGroup): Example {
    const ex = new Example();
    ex.rm = group.value.exampleRm;
    ex.de = group.value.exampleDe;
    return ex;
  }

  joinExampleStrings(): Example[] {
    const examples: Example[] = [];
    this.exampleControls.controls.forEach(group => examples.push(this.joinExampleString(group as UntypedFormGroup)));
    return examples;
  }
}
