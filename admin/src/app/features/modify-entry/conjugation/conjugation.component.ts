import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InflectionSubType } from 'src/app/models/inflection';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-conjugation',
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.scss']
})
export class ConjugationComponent implements OnInit {

  @Input()
  set lemmaVersion(lemmaVersion: LemmaVersion | undefined) {
    this.workingLemmaVersion = JSON.parse(JSON.stringify(lemmaVersion));
    this.originalLemmaVersion = JSON.parse(JSON.stringify(lemmaVersion));
  }
  get lexEntries(): LemmaVersion | undefined {
      return this.workingLemmaVersion;
  }

  validateForm!: FormGroup;

  subTypes: InflectionSubType[] = [];

  workingLemmaVersion: LemmaVersion = new LemmaVersion();
  originalLemmaVersion?: LemmaVersion;

  constructor(
    private fb: FormBuilder,
    private inflectionService: InflectionService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
  ) { }

  ngOnInit(): void {
    this.setUpForm();

    this.inflectionService.getInflectionSubtypes(this.languageSelectionService.getCurrentLanguage(), 'VERB').subscribe(value => {
      this.subTypes = value;
    });
  }

  updateForms() {
    this.generateForms(this.validateForm.controls['RInflectionSubtype'].value, this.validateForm.controls['infinitiv'].value);
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
    this.modal.close(this.validateForm.value);
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      infinitiv: new FormControl(this.workingLemmaVersion.lemmaValues.infinitiv, Validators.required),
      RInflectionSubtype: new FormControl(this.workingLemmaVersion.lemmaValues.RInflectionSubtype ? this.workingLemmaVersion.lemmaValues.RInflectionSubtype : ""),

      preschentsing1: new FormControl(this.workingLemmaVersion.lemmaValues.preschentsing1),
      preschentsing2: new FormControl(this.workingLemmaVersion.lemmaValues.preschentsing2),
      preschentsing3: new FormControl(this.workingLemmaVersion.lemmaValues.preschentsing3),
      preschentplural1: new FormControl(this.workingLemmaVersion.lemmaValues.preschentplural1),
      preschentplural2: new FormControl(this.workingLemmaVersion.lemmaValues.preschentplural2),
      preschentplural3: new FormControl(this.workingLemmaVersion.lemmaValues.preschentplural3),

      imperfectsing1: new FormControl(this.workingLemmaVersion.lemmaValues.imperfectsing1),
      imperfectsing2: new FormControl(this.workingLemmaVersion.lemmaValues.imperfectsing2),
      imperfectsing3: new FormControl(this.workingLemmaVersion.lemmaValues.imperfectsing3),
      imperfectplural1: new FormControl(this.workingLemmaVersion.lemmaValues.imperfectplural1),
      imperfectplural2: new FormControl(this.workingLemmaVersion.lemmaValues.imperfectplural2),
      imperfectplural3: new FormControl(this.workingLemmaVersion.lemmaValues.imperfectplural3),

      conjunctivsing1: new FormControl(this.workingLemmaVersion.lemmaValues.conjunctivsing1),
      conjunctivsing2: new FormControl(this.workingLemmaVersion.lemmaValues.conjunctivsing2),
      conjunctivsing3: new FormControl(this.workingLemmaVersion.lemmaValues.conjunctivsing3),
      conjunctivplural1: new FormControl(this.workingLemmaVersion.lemmaValues.conjunctivplural1),
      conjunctivplural2: new FormControl(this.workingLemmaVersion.lemmaValues.conjunctivplural2),
      conjunctivplural3: new FormControl(this.workingLemmaVersion.lemmaValues.conjunctivplural3),

      cundizionalsing1: new FormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing1),
      cundizionalsing2: new FormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing2),
      cundizionalsing3: new FormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing3),
      cundizionalplural1: new FormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural1),
      cundizionalplural2: new FormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural2),
      cundizionalplural3: new FormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural3),

      futursing1: new FormControl(this.workingLemmaVersion.lemmaValues.futursing1),
      futursing2: new FormControl(this.workingLemmaVersion.lemmaValues.futursing2),
      futursing3: new FormControl(this.workingLemmaVersion.lemmaValues.futursing3),
      futurplural1: new FormControl(this.workingLemmaVersion.lemmaValues.futurplural1),
      futurplural2: new FormControl(this.workingLemmaVersion.lemmaValues.futurplural2),
      futurplural3: new FormControl(this.workingLemmaVersion.lemmaValues.futurplural3),

      participperfectms: new FormControl(this.workingLemmaVersion.lemmaValues.participperfectms),
      participperfectfs: new FormControl(this.workingLemmaVersion.lemmaValues.participperfectfs),
      participperfectmp: new FormControl(this.workingLemmaVersion.lemmaValues.participperfectmp),
      participperfectfp: new FormControl(this.workingLemmaVersion.lemmaValues.participperfectfp),

      imperativ1: new FormControl(this.workingLemmaVersion.lemmaValues.imperativ1),
      imperativ2: new FormControl(this.workingLemmaVersion.lemmaValues.imperativ2),

      gerundium: new FormControl(this.workingLemmaVersion.lemmaValues.gerundium),
    });
  }

  private generateForms(subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'VERB', subTypeId, baseForm).subscribe(values => {
      this.workingLemmaVersion.lemmaValues.RInflectionSubtype = subTypeId;
      this.workingLemmaVersion.lemmaValues = {
        ...this.workingLemmaVersion.lemmaValues,
        ...values.inflectionValues
      };
      this.setUpForm();
    });
  }
}
