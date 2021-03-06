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

  isRegular = true;

  constructor(
    private fb: FormBuilder,
    private inflectionService: InflectionService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
  ) { }

  ngOnInit(): void {
    this.setUpForm();

    this.inflectionService.getInflectionSubtypes(this.languageSelectionService.getCurrentLanguage(), 'V').subscribe(value => {
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
    this.modal.close(this.validateForm.getRawValue());
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      infinitiv: new FormControl(this.workingLemmaVersion.lemmaValues.infinitiv, Validators.required),
      RInflectionSubtype: new FormControl(this.workingLemmaVersion.lemmaValues.RInflectionSubtype ? this.workingLemmaVersion.lemmaValues.RInflectionSubtype : ""),
      RRegularInflection: new FormControl(this.workingLemmaVersion.lemmaValues.RRegularInflection ? this.workingLemmaVersion.lemmaValues.RRegularInflection : true),

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

    this.validateForm.get("RRegularInflection")!.valueChanges.subscribe(value => {
      this.isRegular = value;
   });
  }

  private generateForms(subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'V', subTypeId, baseForm).subscribe(values => {
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
      this.workingLemmaVersion.lemmaValues.preschentsing1 ||
      this.workingLemmaVersion.lemmaValues.preschentsing2 ||
      this.workingLemmaVersion.lemmaValues.preschentsing3 ||
      this.workingLemmaVersion.lemmaValues.preschentplural1 ||
      this.workingLemmaVersion.lemmaValues.preschentplural2 ||
      this.workingLemmaVersion.lemmaValues.preschentplural3 ||

      this.workingLemmaVersion.lemmaValues.imperfectsing1 ||
      this.workingLemmaVersion.lemmaValues.imperfectsing2 ||
      this.workingLemmaVersion.lemmaValues.imperfectsing3 ||
      this.workingLemmaVersion.lemmaValues.imperfectplural1 ||
      this.workingLemmaVersion.lemmaValues.imperfectplural2 ||
      this.workingLemmaVersion.lemmaValues.imperfectplural3 ||

      this.workingLemmaVersion.lemmaValues.conjunctivsing1 ||
      this.workingLemmaVersion.lemmaValues.conjunctivsing2 ||
      this.workingLemmaVersion.lemmaValues.conjunctivsing3 ||
      this.workingLemmaVersion.lemmaValues.conjunctivplural1 ||
      this.workingLemmaVersion.lemmaValues.conjunctivplural2 ||
      this.workingLemmaVersion.lemmaValues.conjunctivplural3 ||

      this.workingLemmaVersion.lemmaValues.cundizionalsing1 ||
      this.workingLemmaVersion.lemmaValues.cundizionalsing2 ||
      this.workingLemmaVersion.lemmaValues.cundizionalsing3 ||
      this.workingLemmaVersion.lemmaValues.cundizionalplural1 ||
      this.workingLemmaVersion.lemmaValues.cundizionalplural2 ||
      this.workingLemmaVersion.lemmaValues.cundizionalplural3 ||

      this.workingLemmaVersion.lemmaValues.futursing1 ||
      this.workingLemmaVersion.lemmaValues.futursing2 ||
      this.workingLemmaVersion.lemmaValues.futursing3 ||
      this.workingLemmaVersion.lemmaValues.futurplural1 ||
      this.workingLemmaVersion.lemmaValues.futurplural2 ||
      this.workingLemmaVersion.lemmaValues.futurplural3 ||

      this.workingLemmaVersion.lemmaValues.participperfectms ||
      this.workingLemmaVersion.lemmaValues.participperfectfs ||
      this.workingLemmaVersion.lemmaValues.participperfectmp ||
      this.workingLemmaVersion.lemmaValues.participperfectfp ||

      this.workingLemmaVersion.lemmaValues.imperativ1 ||
      this.workingLemmaVersion.lemmaValues.imperativ2 ||

      this.workingLemmaVersion.lemmaValues.gerundium
    ) {
      return false;
    }
    return true;
  }

  private guessInflectionSubtype() {
    const baseForm = this.workingLemmaVersion.lemmaValues.infinitiv ? this.workingLemmaVersion.lemmaValues.infinitiv : this.workingLemmaVersion.lemmaValues.RStichwort ? this.workingLemmaVersion.lemmaValues.RStichwort : "";
    if (baseForm === "") {
      console.log("No base form defined, guessing impossible");
      return;
    }

    const genus = this.workingLemmaVersion.lemmaValues.RGenus;
    const flex = this.workingLemmaVersion.lemmaValues.RFlex;
    this.inflectionService.guessInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'V', baseForm, genus, flex).subscribe(values => {
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
