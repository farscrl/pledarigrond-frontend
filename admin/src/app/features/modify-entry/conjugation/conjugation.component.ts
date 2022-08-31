import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InflectionSubType } from 'src/app/models/inflection';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { Language } from "../../../models/security";

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

  validateForm!: UntypedFormGroup;

  subTypes: InflectionSubType[] = [];

  workingLemmaVersion: LemmaVersion = new LemmaVersion();
  originalLemmaVersion?: LemmaVersion;

  isRegular = true;

  constructor(
    private fb: UntypedFormBuilder,
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

  hasEncliticForms(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return language === Language.SURMIRAN;
  }

  private returnValues() {
    this.modal.close(this.validateForm.getRawValue());
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      infinitiv: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.infinitiv, Validators.required),
      RInflectionSubtype: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.RInflectionSubtype ? this.workingLemmaVersion.lemmaValues.RInflectionSubtype : ""),
      RRegularInflection: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.RRegularInflection ? this.workingLemmaVersion.lemmaValues.RRegularInflection : true),

      preschentsing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing1),
      preschentsing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing2),
      preschentsing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing3),
      preschentplural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentplural1),
      preschentplural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentplural2),
      preschentplural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentplural3),

      imperfectsing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing1),
      imperfectsing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing2),
      imperfectsing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing3),
      imperfectplural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectplural1),
      imperfectplural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectplural2),
      imperfectplural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectplural3),

      conjunctivsing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctivsing1),
      conjunctivsing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctivsing2),
      conjunctivsing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctivsing3),
      conjunctivplural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctivplural1),
      conjunctivplural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctivplural2),
      conjunctivplural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctivplural3),

      cundizionalsing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing1),
      cundizionalsing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing2),
      cundizionalsing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing3),
      cundizionalplural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural1),
      cundizionalplural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural2),
      cundizionalplural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural3),

      futursing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing1),
      futursing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing2),
      futursing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing3),
      futurplural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurplural1),
      futurplural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurplural2),
      futurplural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurplural3),

      participperfectms: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectms),
      participperfectfs: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectfs),
      participperfectmp: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectmp),
      participperfectfp: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectfp),

      imperativ1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ1),
      imperativ2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ2),

      gerundium: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.gerundium),

      preschentsing1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing1enclitic),
      preschentsing2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing2enclitic),
      preschentsing3encliticm: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing3encliticm),
      preschentsing3encliticf: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentsing3encliticf),
      preschentplural1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentplural1enclitic),
      preschentplural2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentplural2enclitic),
      preschentplural3enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.preschentplural3enclitic),

      imperfectsing1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing1enclitic),
      imperfectsing2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing2enclitic),
      imperfectsing3encliticm: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing3encliticm),
      imperfectsing3encliticf: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectsing3encliticf),
      imperfectplural1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectplural1enclitic),
      imperfectplural2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectplural2enclitic),
      imperfectplural3enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperfectplural3enclitic),

      cundizionalsing1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing1enclitic),
      cundizionalsing2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing2enclitic),
      cundizionalsing3encliticm: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing3encliticm),
      cundizionalsing3encliticf: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalsing3encliticf),
      cundizionalplural1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural1enclitic),
      cundizionalplural2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural2enclitic),
      cundizionalplural3enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.cundizionalplural3enclitic),

      futursing1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing1enclitic),
      futursing2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing2enclitic),
      futursing3encliticm: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing3encliticm),
      futursing3encliticf: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futursing3encliticf),
      futurplural1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurplural1enclitic),
      futurplural2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurplural2enclitic),
      futurplural3enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurplural3enclitic),
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

      this.workingLemmaVersion.lemmaValues.gerundium ||

      this.workingLemmaVersion.lemmaValues.preschentsing1enclitic ||
      this.workingLemmaVersion.lemmaValues.preschentsing2enclitic ||
      this.workingLemmaVersion.lemmaValues.preschentsing3encliticm ||
      this.workingLemmaVersion.lemmaValues.preschentsing3encliticf ||
      this.workingLemmaVersion.lemmaValues.preschentplural1enclitic ||
      this.workingLemmaVersion.lemmaValues.preschentplural2enclitic ||
      this.workingLemmaVersion.lemmaValues.preschentplural3enclitic ||

      this.workingLemmaVersion.lemmaValues.imperfectsing1enclitic ||
      this.workingLemmaVersion.lemmaValues.imperfectsing2enclitic ||
      this.workingLemmaVersion.lemmaValues.imperfectsing3encliticm ||
      this.workingLemmaVersion.lemmaValues.imperfectsing3encliticf ||
      this.workingLemmaVersion.lemmaValues.imperfectplural1enclitic ||
      this.workingLemmaVersion.lemmaValues.imperfectplural2enclitic ||
      this.workingLemmaVersion.lemmaValues.imperfectplural3enclitic ||

      this.workingLemmaVersion.lemmaValues.cundizionalsing1enclitic ||
      this.workingLemmaVersion.lemmaValues.cundizionalsing2enclitic ||
      this.workingLemmaVersion.lemmaValues.cundizionalsing3encliticm ||
      this.workingLemmaVersion.lemmaValues.cundizionalsing3encliticf ||
      this.workingLemmaVersion.lemmaValues.cundizionalplural1enclitic ||
      this.workingLemmaVersion.lemmaValues.cundizionalplural2enclitic ||
      this.workingLemmaVersion.lemmaValues.cundizionalplural3enclitic ||

      this.workingLemmaVersion.lemmaValues.futursing1enclitic ||
      this.workingLemmaVersion.lemmaValues.futursing2enclitic ||
      this.workingLemmaVersion.lemmaValues.futursing3encliticm ||
      this.workingLemmaVersion.lemmaValues.futursing3encliticf ||
      this.workingLemmaVersion.lemmaValues.futurplural1enclitic ||
      this.workingLemmaVersion.lemmaValues.futurplural2enclitic ||
      this.workingLemmaVersion.lemmaValues.futurplural3enclitic
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
