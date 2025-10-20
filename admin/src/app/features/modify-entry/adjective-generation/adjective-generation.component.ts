import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InflectionSubType } from 'src/app/models/inflection';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { EnvironmentService } from "../../../services/environment.service";
import { Adjective, EntryVersionInternalDto } from '../../../models/dictionary';
import { CopyService } from '../../../services/copy.service';
import { Language } from '../../../models/security';

export class AdjectiveGenerationData {
  version?: EntryVersionInternalDto;
}
@Component({
    selector: 'app-adjective-generation',
    templateUrl: './adjective-generation.component.html',
    styleUrls: ['./adjective-generation.component.scss'],
    standalone: false
})
export class AdjectiveGenerationComponent implements OnInit {

  private version?: EntryVersionInternalDto;

  validateForm!: UntypedFormGroup;

  subTypes: InflectionSubType[] = [];

  working: Adjective = new Adjective();

  isRegular = true;

  constructor(
    private fb: UntypedFormBuilder,
    private inflectionService: InflectionService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
    public copyService: CopyService,
    public environmentService: EnvironmentService,
    @Inject(NZ_MODAL_DATA) data: AdjectiveGenerationData,
  ) {
    this.version = data.version;
    if (this.version) {
      this.working = JSON.parse(JSON.stringify(this.version.inflection?.adjective || new Adjective()));
    }
  }

  ngOnInit(): void {
    this.setUpForm();

    this.inflectionService.getInflectionSubtypes(this.languageSelectionService.getCurrentLanguage(), 'ADJECTIVE').subscribe(value => {
      this.subTypes = value;
    });
    if (this.working.irregular === true) {
      this.isRegular = false;
    }

    if (this.shouldGuessInflectionSubtype()) {
      this.guessInflectionSubtype();
    }
  }

  updateForms() {
    this.generateForms(this.validateForm.controls['inflectionSubtype'].value, this.validateForm.controls['baseForm'].value);
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.working = JSON.parse(JSON.stringify(this.version!.inflection?.adjective || new Adjective()));
    this.setUpForm();
  }

  ok() {
    if (this.validateForm.valid) {
      this.returnValues();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private generateAdjectiveObject() {
    this.working.baseForm = this.validateForm.get('baseForm')?.value;
    this.working.inflectionSubtype = this.validateForm.get('inflectionSubtype')?.value;
    this.working.irregular = this.validateForm.get('irregular')?.value;

    this.working.mSingular = this.validateForm.get('mSingular')?.value;
    this.working.fSingular = this.validateForm.get('fSingular')?.value;
    this.working.mPlural = this.validateForm.get('mPlural')?.value;
    this.working.fPlural = this.validateForm.get('fPlural')?.value;
    this.working.adverbialForm = this.validateForm.get('adverbialForm')?.value;
    this.working.predicative = this.validateForm.get('predicative')?.value;
  }

  private returnValues() {
    this.generateAdjectiveObject();
    this.modal.close(this.working);
}

  private setUpForm() {
    this.validateForm = this.fb.group({
      baseForm: new UntypedFormControl(this.working.baseForm),
      inflectionSubtype: new UntypedFormControl(this.working.inflectionSubtype ? this.working.inflectionSubtype : ""),
      irregular: new UntypedFormControl(this.working.irregular ? this.working.irregular : false),

      mSingular: new UntypedFormControl(this.working.mSingular),
      fSingular: new UntypedFormControl(this.working.fSingular),
      mPlural: new UntypedFormControl(this.working.mPlural),
      fPlural: new UntypedFormControl(this.working.fPlural),
      adverbialForm: new UntypedFormControl(this.working.adverbialForm),
      predicative: new UntypedFormControl(this.working.predicative),
    });

    this.validateForm.get("irregular")!.valueChanges.subscribe(value => {
      this.isRegular = !value;
    });
    this.isRegular = !this.validateForm.get('irregular')?.value;
  }

  private generateForms(subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'ADJECTIVE', subTypeId, baseForm).subscribe(inflection => {
      this.working = inflection.adjective!;
      this.isRegular = true;
      this.setUpForm();
    });
  }

  private shouldGuessInflectionSubtype(): boolean {
    if (
      this.working.mSingular ||
      this.working.fSingular ||
      this.working.mPlural ||
      this.working.fPlural ||
      this.working.adverbialForm ||
      this.working.predicative
    ) {
      return false;
    }
    return true;
  }

  private guessInflectionSubtype() {
    const baseForm = this.working.baseForm ? this.working.baseForm : this.version?.rmStichwort ? this.version.rmStichwort : "";
    if (baseForm === "") {
      console.log("No base form defined, guessing impossible");
      return;
    }

    const genus = this.version?.rmGenus;
    const flex = this.version?.rmFlex;
    this.inflectionService.guessInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'ADJECTIVE', baseForm, genus, flex).subscribe(inflection => {
      // for short words the guessing can be empty -> just ignore empty response
      if (!inflection) {
        return;
      }
      this.isRegular = true;
      this.working = inflection.adjective!;
      this.setUpForm();
    });
  }

  copyAdjective() {
    this.generateAdjectiveObject();
    const toCopy: Adjective = JSON.parse(JSON.stringify(this.working || new Adjective()));
    this.copyService.copyInflectionAdjective(toCopy);
  }

  pasteAdjective() {
    if (!this.copyService.canPasteInflectionAdjective()) {
      return;
    }

    this.copyForms(this.copyService.inflectionAdjective);
  }

  hasPredicative(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.SURSILVAN);
  }

  private copyForms(from: Adjective) {
    this.working.baseForm = from.baseForm;
    this.working.inflectionSubtype = from.inflectionSubtype;
    this.working.irregular = from.irregular;

    this.working.mSingular = from.mSingular;
    this.working.fSingular = from.fSingular;
    this.working.mPlural = from.mPlural;
    this.working.fPlural = from.fPlural;
    this.working.adverbialForm = from.adverbialForm;
    this.working.predicative = from.predicative;

    this.setUpForm();
  }
}
