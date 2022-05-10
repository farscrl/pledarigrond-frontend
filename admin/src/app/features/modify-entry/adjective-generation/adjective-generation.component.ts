import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InflectionSubType } from 'src/app/models/inflection';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-adjective-generation',
  templateUrl: './adjective-generation.component.html',
  styleUrls: ['./adjective-generation.component.scss']
})
export class AdjectiveGenerationComponent implements OnInit {

  @Input()
  set lemmaVersion(lemmaVersion: LemmaVersion | undefined) {
    this.workingLemmaVersion = JSON.parse(JSON.stringify(lemmaVersion));
    this.originalLemmaVersion = JSON.parse(JSON.stringify(lemmaVersion));
  }

  validateForm!: FormGroup;

  subTypes: InflectionSubType[] = [];

  workingLemmaVersion: LemmaVersion = new LemmaVersion();
  originalLemmaVersion?: LemmaVersion;

  isRegular = true;

  constructor(
    private fb: FormBuilder,
    private inflectionService: InflectionService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
  ) { }

  ngOnInit(): void {
    this.setUpForm();

    this.inflectionService.getInflectionSubtypes(this.languageSelectionService.getCurrentLanguage(), 'ADJECTIVE').subscribe(value => {
      this.subTypes = value;
    });
    if (this.workingLemmaVersion.lemmaValues.RRegularInflection === "false") {
      this.isRegular = false;
    }

    if (this.shouldGuessInflectionSubtype()) {
      this.guessInflectionSubtype();
    }
  }

  updateForms() {
    this.generateForms(this.validateForm.controls['RInflectionSubtype'].value, this.validateForm.controls['baseForm'].value);
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
      baseForm: new FormControl(this.workingLemmaVersion.lemmaValues.RStichwort),
      RInflectionSubtype: new FormControl(this.workingLemmaVersion.lemmaValues.RInflectionSubtype ? this.workingLemmaVersion.lemmaValues.RInflectionSubtype : ""),
      RRegularInflection: new FormControl(this.workingLemmaVersion.lemmaValues.RRegularInflection ? this.workingLemmaVersion.lemmaValues.RRegularInflection : true),

      mSingular: new FormControl(this.workingLemmaVersion.lemmaValues.mSingular),
      fSingular: new FormControl(this.workingLemmaVersion.lemmaValues.fSingular),
      mPlural: new FormControl(this.workingLemmaVersion.lemmaValues.mPlural),
      fPlural: new FormControl(this.workingLemmaVersion.lemmaValues.fPlural),
      adverbialForm: new FormControl(this.workingLemmaVersion.lemmaValues.adverbialForm),
    });

    this.validateForm.get("RRegularInflection")!.valueChanges.subscribe(value => {
      this.isRegular = value;
   });
  }

  private generateForms(subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'ADJECTIVE', subTypeId, baseForm).subscribe(values => {
      this.workingLemmaVersion.lemmaValues.RInflectionSubtype = subTypeId;
      this.workingLemmaVersion.lemmaValues = {
        ...this.workingLemmaVersion.lemmaValues,
        ...values.inflectionValues
      };
      this.isRegular = true;
      this.setUpForm();
    });
  }

  private shouldGuessInflectionSubtype(): boolean {
    if (
      this.workingLemmaVersion.lemmaValues.mSingular ||
      this.workingLemmaVersion.lemmaValues.fSingular ||
      this.workingLemmaVersion.lemmaValues.mPlural ||
      this.workingLemmaVersion.lemmaValues.fPlural ||
      this.workingLemmaVersion.lemmaValues.adverbialForm
    ) {
      return false;
    }
    return true;
  }

  private guessInflectionSubtype() {
    const baseForm = this.workingLemmaVersion.lemmaValues.RStichwort ? this.workingLemmaVersion.lemmaValues.RStichwort : "";
    if (baseForm === "") {
      console.log("No base form defined, guessing impossible");
      return;
    }

    const genus = this.workingLemmaVersion.lemmaValues.RGenus;
    const flex = this.workingLemmaVersion.lemmaValues.RFlex;
    this.inflectionService.guessInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'ADJECTIVE', baseForm, genus, flex).subscribe(values => {
      // for short words the guessing can be empty -> just ignore empty response
      if (!values) {
        return;
      }
      this.isRegular = true;
      this.workingLemmaVersion.lemmaValues.RInflectionSubtype = values.inflectionSubType.id;
      this.workingLemmaVersion.lemmaValues = {
        ...this.workingLemmaVersion.lemmaValues,
        ...values.inflectionValues
      };
      this.setUpForm();
    });
  }
}
