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
  lemmaVersion: LemmaVersion = new LemmaVersion();

  validateForm!: FormGroup;

  subTypes: InflectionSubType[] = [];

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

  subTypeFormChanged() {
    this.generateForms(this.validateForm.controls['RInflectionSubType'].value, this.validateForm.controls['infinitiv'].value);
  }

  cancel() {
    this.modal.close();
  }

  reset() {
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
      infinitiv: new FormControl(this.lemmaVersion.lemmaValues.infinitiv, Validators.required),
      RInflectionSubType: new FormControl(this.lemmaVersion.lemmaValues.RInflectionSubType ? this.lemmaVersion.lemmaValues.RInflectionSubType : ""),

      preschentsing1: new FormControl(this.lemmaVersion.lemmaValues.preschentsing1, Validators.required),
      preschentsing2: new FormControl(this.lemmaVersion.lemmaValues.preschentsing2, Validators.required),
      preschentsing3: new FormControl(this.lemmaVersion.lemmaValues.preschentsing3, Validators.required),
      preschentplural1: new FormControl(this.lemmaVersion.lemmaValues.preschentplural1, Validators.required),
      preschentplural2: new FormControl(this.lemmaVersion.lemmaValues.preschentplural2, Validators.required),
      preschentplural3: new FormControl(this.lemmaVersion.lemmaValues.preschentplural3, Validators.required),

      imperfectsing1: new FormControl(this.lemmaVersion.lemmaValues.imperfectsing1, Validators.required),
      imperfectsing2: new FormControl(this.lemmaVersion.lemmaValues.imperfectsing2, Validators.required),
      imperfectsing3: new FormControl(this.lemmaVersion.lemmaValues.imperfectsing3, Validators.required),
      imperfectplural1: new FormControl(this.lemmaVersion.lemmaValues.imperfectplural1, Validators.required),
      imperfectplural2: new FormControl(this.lemmaVersion.lemmaValues.imperfectplural2, Validators.required),
      imperfectplural3: new FormControl(this.lemmaVersion.lemmaValues.imperfectplural3, Validators.required),

      conjunctivsing1: new FormControl(this.lemmaVersion.lemmaValues.conjunctivsing1, Validators.required),
      conjunctivsing2: new FormControl(this.lemmaVersion.lemmaValues.conjunctivsing2, Validators.required),
      conjunctivsing3: new FormControl(this.lemmaVersion.lemmaValues.conjunctivsing3, Validators.required),
      conjunctivplural1: new FormControl(this.lemmaVersion.lemmaValues.conjunctivplural1, Validators.required),
      conjunctivplural2: new FormControl(this.lemmaVersion.lemmaValues.conjunctivplural2, Validators.required),
      conjunctivplural3: new FormControl(this.lemmaVersion.lemmaValues.conjunctivplural3, Validators.required),

      cundizionalsing1: new FormControl(this.lemmaVersion.lemmaValues.cundizionalsing1, Validators.required),
      cundizionalsing2: new FormControl(this.lemmaVersion.lemmaValues.cundizionalsing2, Validators.required),
      cundizionalsing3: new FormControl(this.lemmaVersion.lemmaValues.cundizionalsing3, Validators.required),
      cundizionalplural1: new FormControl(this.lemmaVersion.lemmaValues.cundizionalplural1, Validators.required),
      cundizionalplural2: new FormControl(this.lemmaVersion.lemmaValues.cundizionalplural2, Validators.required),
      cundizionalplural3: new FormControl(this.lemmaVersion.lemmaValues.cundizionalplural3, Validators.required),

      futursing1: new FormControl(this.lemmaVersion.lemmaValues.futursing1, Validators.required),
      futursing2: new FormControl(this.lemmaVersion.lemmaValues.futursing2, Validators.required),
      futursing3: new FormControl(this.lemmaVersion.lemmaValues.futursing3, Validators.required),
      futurplural1: new FormControl(this.lemmaVersion.lemmaValues.futurplural1, Validators.required),
      futurplural2: new FormControl(this.lemmaVersion.lemmaValues.futurplural2, Validators.required),
      futurplural3: new FormControl(this.lemmaVersion.lemmaValues.futurplural3, Validators.required),

      participperfectms: new FormControl(this.lemmaVersion.lemmaValues.participperfectms, Validators.required),
      participperfectfs: new FormControl(this.lemmaVersion.lemmaValues.participperfectfs, Validators.required),
      participperfectmp: new FormControl(this.lemmaVersion.lemmaValues.participperfectmp, Validators.required),
      participperfectfp: new FormControl(this.lemmaVersion.lemmaValues.participperfectfp, Validators.required),

      imperativ1: new FormControl(this.lemmaVersion.lemmaValues.imperativ1, Validators.required),
      imperativ2: new FormControl(this.lemmaVersion.lemmaValues.imperativ2, Validators.required),

      gerundium: new FormControl(this.lemmaVersion.lemmaValues.gerundium, Validators.required),
    });
  }

  private generateForms(subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'VERB', subTypeId, baseForm).subscribe(values => {
      console.log(values);
    });
  }
}
