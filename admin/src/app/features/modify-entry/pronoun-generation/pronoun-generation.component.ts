import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { EnvironmentService } from "../../../services/environment.service";
import { MainEntryData } from '../main-entry/main-entry.component';

export class PronounGenerationData {
  lemmaVersion?: LemmaVersion;
}
@Component({
  selector: 'app-pronoun-generation',
  templateUrl: './pronoun-generation.component.html',
  styleUrls: ['./pronoun-generation.component.scss']
})
export class PronounGenerationComponent implements OnInit {

  private lemmaVersion?: LemmaVersion;

  validateForm!: UntypedFormGroup;

  workingLemmaVersion: LemmaVersion = new LemmaVersion();
  originalLemmaVersion?: LemmaVersion;

  constructor(
    private fb: UntypedFormBuilder,
    private inflectionService: InflectionService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
    public environmentService: EnvironmentService,
    @Inject(NZ_MODAL_DATA) data: PronounGenerationData,
  ) {
    this.lemmaVersion = data.lemmaVersion;
    if (this.lemmaVersion) {
      this.workingLemmaVersion = JSON.parse(JSON.stringify(this.lemmaVersion));
      this.originalLemmaVersion = JSON.parse(JSON.stringify(this.lemmaVersion));
    }
  }

  ngOnInit(): void {
    this.setUpForm();
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.workingLemmaVersion = JSON.parse(JSON.stringify(this.originalLemmaVersion));
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

  private returnValues() {
    this.modal.close(this.validateForm.getRawValue());
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      baseForm: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.baseForm),

      mSingular: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.mSingular),
      fSingular: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.fSingular),
      mPlural: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.mPlural),
      fPlural: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.fPlural),
    });
  }
}
