import { Component, Inject, Input } from '@angular/core';
import { LemmaVersion } from '../../../models/lemma-version';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { InflectionService } from '../../../services/inflection.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { EnvironmentService } from '../../../services/environment.service';
import { MainEntryData } from '../main-entry/main-entry.component';

export class OtherGenerationData {
  lemmaVersion?: LemmaVersion;
}

@Component({
    selector: 'app-other-generation',
    templateUrl: './other-generation.component.html',
    styleUrls: ['./other-generation.component.scss'],
    standalone: false
})
export class OtherGenerationComponent {

  private lemmaVersion?: LemmaVersion;

  validateForm!: UntypedFormGroup;

  workingLemmaVersion: LemmaVersion = new LemmaVersion();
  originalLemmaVersion?: LemmaVersion;

  constructor(
    private fb: UntypedFormBuilder,
    private modal: NzModalRef,
    public environmentService: EnvironmentService,
    @Inject(NZ_MODAL_DATA) data: OtherGenerationData,
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

      otherForm1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.otherForm1),
      otherForm2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.otherForm2),
      otherForm3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.otherForm3),
      otherForm4: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.otherForm4),
    });
  }
}
