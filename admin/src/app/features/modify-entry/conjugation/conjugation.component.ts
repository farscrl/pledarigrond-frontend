import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InflectionSubType } from 'src/app/models/inflection';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { Language } from "../../../models/security";
import { CopyService } from "../../../services/copy.service";
import { EditorService } from "../../../services/editor.service";

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
    public copyService: CopyService,
    public editorService: EditorService,
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
    return language === Language.SURMIRAN || language === Language.SUTSILVAN || language === Language.PUTER || language === Language.VALLADER;
  }

  hasEncliticFutur(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.SURMIRAN || language === Language.PUTER || language === Language.VALLADER);
  }

  hasFuturDubitativ(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.PUTER);
  }

  hasConjunctiv2(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.PUTER || language === Language.VALLADER || language === Language.SURSILVAN);
  }

  hasExtendedImperativ(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.PUTER || language === Language.VALLADER);
  }

  copyConjugation() {
    this.copyService.copyConjugation(this.workingLemmaVersion?.lexEntryId!, this.workingLemmaVersion.lemmaValues.infinitiv!);
  }

  pasteConjugation() {
    if (!this.copyService.canPasteConjugation()) {
      return;
    }
    this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), this.copyService.lexEntryId!).subscribe(lexEntry => {
      this.copyVerbForms(lexEntry.current);
    });
  }

  triggerChangeDetectionForAutoSizeLater() {
    setTimeout(() => {
      this.triggerChangeDetectionForAutoSize();
    }, 150);
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

      conjunctiv2sing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctiv2sing1),
      conjunctiv2sing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctiv2sing2),
      conjunctiv2sing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctiv2sing3),
      conjunctiv2plural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctiv2plural1),
      conjunctiv2plural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctiv2plural2),
      conjunctiv2plural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.conjunctiv2plural3),

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

      futurdubitativsing1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing1),
      futurdubitativsing2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing2),
      futurdubitativsing3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing3),
      futurdubitativplural1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativplural1),
      futurdubitativplural2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativplural2),
      futurdubitativplural3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativplural3),

      participperfectms: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectms),
      participperfectfs: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectfs),
      participperfectmp: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectmp),
      participperfectfp: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.participperfectfp),

      imperativ1: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ1),
      imperativ2: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ2),
      imperativ3: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ3),
      imperativ4: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ4),
      imperativ5: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ5),
      imperativ6: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.imperativ6),

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

      futurdubitativsing1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing1enclitic),
      futurdubitativsing2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing2enclitic),
      futurdubitativsing3encliticm: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing3encliticm),
      futurdubitativsing3encliticf: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativsing3encliticf),
      futurdubitativplural1enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativplural1enclitic),
      futurdubitativplural2enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativplural2enclitic),
      futurdubitativplural3enclitic: new UntypedFormControl(this.workingLemmaVersion.lemmaValues.futurdubitativplural3enclitic),
    });

    this.validateForm.get("RRegularInflection")!.valueChanges.subscribe(value => {
      this.isRegular = value;
    });

    this.triggerChangeDetectionForAutoSizeLater();
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

      this.workingLemmaVersion.lemmaValues.conjunctiv2sing1 ||
      this.workingLemmaVersion.lemmaValues.conjunctiv2sing2 ||
      this.workingLemmaVersion.lemmaValues.conjunctiv2sing3 ||
      this.workingLemmaVersion.lemmaValues.conjunctiv2plural1 ||
      this.workingLemmaVersion.lemmaValues.conjunctiv2plural2 ||
      this.workingLemmaVersion.lemmaValues.conjunctiv2plural3 ||

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

      this.workingLemmaVersion.lemmaValues.futurdubitativsing1 ||
      this.workingLemmaVersion.lemmaValues.futurdubitativsing2 ||
      this.workingLemmaVersion.lemmaValues.futurdubitativsing3 ||
      this.workingLemmaVersion.lemmaValues.futurdubitativplural1 ||
      this.workingLemmaVersion.lemmaValues.futurdubitativplural2 ||
      this.workingLemmaVersion.lemmaValues.futurdubitativplural3 ||

      this.workingLemmaVersion.lemmaValues.participperfectms ||
      this.workingLemmaVersion.lemmaValues.participperfectfs ||
      this.workingLemmaVersion.lemmaValues.participperfectmp ||
      this.workingLemmaVersion.lemmaValues.participperfectfp ||

      this.workingLemmaVersion.lemmaValues.imperativ1 ||
      this.workingLemmaVersion.lemmaValues.imperativ2 ||
      this.workingLemmaVersion.lemmaValues.imperativ3 ||
      this.workingLemmaVersion.lemmaValues.imperativ4 ||
      this.workingLemmaVersion.lemmaValues.imperativ5 ||
      this.workingLemmaVersion.lemmaValues.imperativ6 ||

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
      this.workingLemmaVersion.lemmaValues.futurplural3enclitic ||

      this.workingLemmaVersion.lemmaValues.futurdubitativsing1enclitic ||
      this.workingLemmaVersion.lemmaValues.futurdubitativsing2enclitic ||
      this.workingLemmaVersion.lemmaValues.futurdubitativsing3encliticm ||
      this.workingLemmaVersion.lemmaValues.futurdubitativsing3encliticf ||
      this.workingLemmaVersion.lemmaValues.futurdubitativplural1enclitic ||
      this.workingLemmaVersion.lemmaValues.futurdubitativplural2enclitic ||
      this.workingLemmaVersion.lemmaValues.futurdubitativplural3enclitic
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

  private copyVerbForms(toCopy: LemmaVersion) {
    this.workingLemmaVersion.lemmaValues.RInflectionType = toCopy.lemmaValues.RInflectionType;
    this.workingLemmaVersion.lemmaValues.RInflectionSubtype = toCopy.lemmaValues.RInflectionSubtype;
    this.workingLemmaVersion.lemmaValues.RRegularInflection = toCopy.lemmaValues.RRegularInflection;

    this.workingLemmaVersion.lemmaValues.infinitiv = toCopy.lemmaValues.infinitiv;

    this.workingLemmaVersion.lemmaValues.preschentsing1 = toCopy.lemmaValues.preschentsing1;
    this.workingLemmaVersion.lemmaValues.preschentsing2 = toCopy.lemmaValues.preschentsing2;
    this.workingLemmaVersion.lemmaValues.preschentsing3 = toCopy.lemmaValues.preschentsing3;
    this.workingLemmaVersion.lemmaValues.preschentplural1 = toCopy.lemmaValues.preschentplural1;
    this.workingLemmaVersion.lemmaValues.preschentplural2 = toCopy.lemmaValues.preschentplural2;
    this.workingLemmaVersion.lemmaValues.preschentplural3 = toCopy.lemmaValues.preschentplural3;

    this.workingLemmaVersion.lemmaValues.imperfectsing1 = toCopy.lemmaValues.imperfectsing1;
    this.workingLemmaVersion.lemmaValues.imperfectsing2 = toCopy.lemmaValues.imperfectsing2;
    this.workingLemmaVersion.lemmaValues.imperfectsing3 = toCopy.lemmaValues.imperfectsing3;
    this.workingLemmaVersion.lemmaValues.imperfectplural1 = toCopy.lemmaValues.imperfectplural1;
    this.workingLemmaVersion.lemmaValues.imperfectplural2 = toCopy.lemmaValues.imperfectplural2;
    this.workingLemmaVersion.lemmaValues.imperfectplural3 = toCopy.lemmaValues.imperfectplural3;

    this.workingLemmaVersion.lemmaValues.participperfectms = toCopy.lemmaValues.participperfectms;
    this.workingLemmaVersion.lemmaValues.participperfectfs = toCopy.lemmaValues.participperfectfs;
    this.workingLemmaVersion.lemmaValues.participperfectmp = toCopy.lemmaValues.participperfectmp;
    this.workingLemmaVersion.lemmaValues.participperfectfp = toCopy.lemmaValues.participperfectfp;

    this.workingLemmaVersion.lemmaValues.conjunctivsing1 = toCopy.lemmaValues.conjunctivsing1;
    this.workingLemmaVersion.lemmaValues.conjunctivsing2 = toCopy.lemmaValues.conjunctivsing2;
    this.workingLemmaVersion.lemmaValues.conjunctivsing3 = toCopy.lemmaValues.conjunctivsing3;
    this.workingLemmaVersion.lemmaValues.conjunctivplural1 = toCopy.lemmaValues.conjunctivplural1;
    this.workingLemmaVersion.lemmaValues.conjunctivplural2 = toCopy.lemmaValues.conjunctivplural2;
    this.workingLemmaVersion.lemmaValues.conjunctivplural3 = toCopy.lemmaValues.conjunctivplural3;

    this.workingLemmaVersion.lemmaValues.conjunctiv2sing1 = toCopy.lemmaValues.conjunctiv2sing1;
    this.workingLemmaVersion.lemmaValues.conjunctiv2sing2 = toCopy.lemmaValues.conjunctiv2sing2;
    this.workingLemmaVersion.lemmaValues.conjunctiv2sing3 = toCopy.lemmaValues.conjunctiv2sing3;
    this.workingLemmaVersion.lemmaValues.conjunctiv2plural1 = toCopy.lemmaValues.conjunctiv2plural1;
    this.workingLemmaVersion.lemmaValues.conjunctiv2plural2 = toCopy.lemmaValues.conjunctiv2plural2;
    this.workingLemmaVersion.lemmaValues.conjunctiv2plural3 = toCopy.lemmaValues.conjunctiv2plural3;

    this.workingLemmaVersion.lemmaValues.conjunctivimperfectsing1 = toCopy.lemmaValues.conjunctivimperfectsing1;
    this.workingLemmaVersion.lemmaValues.conjunctivimperfectsing2 = toCopy.lemmaValues.conjunctivimperfectsing2;
    this.workingLemmaVersion.lemmaValues.conjunctivimperfectsing3 = toCopy.lemmaValues.conjunctivimperfectsing3;
    this.workingLemmaVersion.lemmaValues.conjunctivimperfectplural1 = toCopy.lemmaValues.conjunctivimperfectplural1;
    this.workingLemmaVersion.lemmaValues.conjunctivimperfectplural2 = toCopy.lemmaValues.conjunctivimperfectplural2;
    this.workingLemmaVersion.lemmaValues.conjunctivimperfectplural3 = toCopy.lemmaValues.conjunctivimperfectplural3;

    this.workingLemmaVersion.lemmaValues.cundizionalsing1 = toCopy.lemmaValues.cundizionalsing1;
    this.workingLemmaVersion.lemmaValues.cundizionalsing2 = toCopy.lemmaValues.cundizionalsing2;
    this.workingLemmaVersion.lemmaValues.cundizionalsing3 = toCopy.lemmaValues.cundizionalsing3;
    this.workingLemmaVersion.lemmaValues.cundizionalplural1 = toCopy.lemmaValues.cundizionalplural1;
    this.workingLemmaVersion.lemmaValues.cundizionalplural2 = toCopy.lemmaValues.cundizionalplural2;
    this.workingLemmaVersion.lemmaValues.cundizionalplural3 = toCopy.lemmaValues.cundizionalplural3;

    this.workingLemmaVersion.lemmaValues.cundizionalindirectsing1 = toCopy.lemmaValues.cundizionalindirectsing1;
    this.workingLemmaVersion.lemmaValues.cundizionalindirectsing2 = toCopy.lemmaValues.cundizionalindirectsing2;
    this.workingLemmaVersion.lemmaValues.cundizionalindirectsing3 = toCopy.lemmaValues.cundizionalindirectsing3;
    this.workingLemmaVersion.lemmaValues.cundizionalindirectplural1 = toCopy.lemmaValues.cundizionalindirectplural1;
    this.workingLemmaVersion.lemmaValues.cundizionalindirectplural2 = toCopy.lemmaValues.cundizionalindirectplural2;
    this.workingLemmaVersion.lemmaValues.cundizionalindirectplural3 = toCopy.lemmaValues.cundizionalindirectplural3;

    this.workingLemmaVersion.lemmaValues.futursing1 = toCopy.lemmaValues.futursing1;
    this.workingLemmaVersion.lemmaValues.futursing2 = toCopy.lemmaValues.futursing2;
    this.workingLemmaVersion.lemmaValues.futursing3 = toCopy.lemmaValues.futursing3;
    this.workingLemmaVersion.lemmaValues.futurplural1 = toCopy.lemmaValues.futurplural1;
    this.workingLemmaVersion.lemmaValues.futurplural2 = toCopy.lemmaValues.futurplural2;
    this.workingLemmaVersion.lemmaValues.futurplural3 = toCopy.lemmaValues.futurplural3;

    this.workingLemmaVersion.lemmaValues.futurdubitativsing1 = toCopy.lemmaValues.futurdubitativsing1;
    this.workingLemmaVersion.lemmaValues.futurdubitativsing2 = toCopy.lemmaValues.futurdubitativsing2;
    this.workingLemmaVersion.lemmaValues.futurdubitativsing3 = toCopy.lemmaValues.futurdubitativsing3;
    this.workingLemmaVersion.lemmaValues.futurdubitativplural1 = toCopy.lemmaValues.futurdubitativplural1;
    this.workingLemmaVersion.lemmaValues.futurdubitativplural2 = toCopy.lemmaValues.futurdubitativplural2;
    this.workingLemmaVersion.lemmaValues.futurdubitativplural3 = toCopy.lemmaValues.futurdubitativplural3;

    this.workingLemmaVersion.lemmaValues.imperativ1 = toCopy.lemmaValues.imperativ1;
    this.workingLemmaVersion.lemmaValues.imperativ2 = toCopy.lemmaValues.imperativ2;
    this.workingLemmaVersion.lemmaValues.imperativ3 = toCopy.lemmaValues.imperativ3;
    this.workingLemmaVersion.lemmaValues.imperativ4 = toCopy.lemmaValues.imperativ4;
    this.workingLemmaVersion.lemmaValues.imperativ5 = toCopy.lemmaValues.imperativ5;
    this.workingLemmaVersion.lemmaValues.imperativ6 = toCopy.lemmaValues.imperativ6;

    this.workingLemmaVersion.lemmaValues.gerundium = toCopy.lemmaValues.gerundium;

    this.workingLemmaVersion.lemmaValues.preschentsing1enclitic = toCopy.lemmaValues.preschentsing1enclitic;
    this.workingLemmaVersion.lemmaValues.preschentsing2enclitic = toCopy.lemmaValues.preschentsing2enclitic;
    this.workingLemmaVersion.lemmaValues.preschentsing3encliticm = toCopy.lemmaValues.preschentsing3encliticm;
    this.workingLemmaVersion.lemmaValues.preschentsing3encliticf = toCopy.lemmaValues.preschentsing3encliticf;
    this.workingLemmaVersion.lemmaValues.preschentplural1enclitic = toCopy.lemmaValues.preschentplural1enclitic;
    this.workingLemmaVersion.lemmaValues.preschentplural2enclitic = toCopy.lemmaValues.preschentplural2enclitic;
    this.workingLemmaVersion.lemmaValues.preschentplural3enclitic = toCopy.lemmaValues.preschentplural3enclitic;

    this.workingLemmaVersion.lemmaValues.imperfectsing1enclitic = toCopy.lemmaValues.imperfectsing1enclitic;
    this.workingLemmaVersion.lemmaValues.imperfectsing2enclitic = toCopy.lemmaValues.imperfectsing2enclitic;
    this.workingLemmaVersion.lemmaValues.imperfectsing3encliticm = toCopy.lemmaValues.imperfectsing3encliticm;
    this.workingLemmaVersion.lemmaValues.imperfectsing3encliticf = toCopy.lemmaValues.imperfectsing3encliticf;
    this.workingLemmaVersion.lemmaValues.imperfectplural1enclitic = toCopy.lemmaValues.imperfectplural1enclitic;
    this.workingLemmaVersion.lemmaValues.imperfectplural2enclitic = toCopy.lemmaValues.imperfectplural2enclitic;
    this.workingLemmaVersion.lemmaValues.imperfectplural3enclitic = toCopy.lemmaValues.imperfectplural3enclitic;

    this.workingLemmaVersion.lemmaValues.cundizionalsing1enclitic = toCopy.lemmaValues.cundizionalsing1enclitic;
    this.workingLemmaVersion.lemmaValues.cundizionalsing2enclitic = toCopy.lemmaValues.cundizionalsing2enclitic;
    this.workingLemmaVersion.lemmaValues.cundizionalsing3encliticm = toCopy.lemmaValues.cundizionalsing3encliticm;
    this.workingLemmaVersion.lemmaValues.cundizionalsing3encliticf = toCopy.lemmaValues.cundizionalsing3encliticf;
    this.workingLemmaVersion.lemmaValues.cundizionalplural1enclitic = toCopy.lemmaValues.cundizionalplural1enclitic;
    this.workingLemmaVersion.lemmaValues.cundizionalplural2enclitic = toCopy.lemmaValues.cundizionalplural2enclitic;
    this.workingLemmaVersion.lemmaValues.cundizionalplural3enclitic = toCopy.lemmaValues.cundizionalplural3enclitic;

    this.workingLemmaVersion.lemmaValues.futursing1enclitic = toCopy.lemmaValues.futursing1enclitic;
    this.workingLemmaVersion.lemmaValues.futursing2enclitic = toCopy.lemmaValues.futursing2enclitic;
    this.workingLemmaVersion.lemmaValues.futursing3encliticm = toCopy.lemmaValues.futursing3encliticm;
    this.workingLemmaVersion.lemmaValues.futursing3encliticf = toCopy.lemmaValues.futursing3encliticf;
    this.workingLemmaVersion.lemmaValues.futurplural1enclitic = toCopy.lemmaValues.futurplural1enclitic;
    this.workingLemmaVersion.lemmaValues.futurplural2enclitic = toCopy.lemmaValues.futurplural2enclitic;
    this.workingLemmaVersion.lemmaValues.futurplural3enclitic = toCopy.lemmaValues.futurplural3enclitic;

    this.workingLemmaVersion.lemmaValues.futurdubitativsing1enclitic = toCopy.lemmaValues.futurdubitativsing1enclitic;
    this.workingLemmaVersion.lemmaValues.futurdubitativsing2enclitic = toCopy.lemmaValues.futurdubitativsing2enclitic;
    this.workingLemmaVersion.lemmaValues.futurdubitativsing3encliticm = toCopy.lemmaValues.futurdubitativsing3encliticm;
    this.workingLemmaVersion.lemmaValues.futurdubitativsing3encliticf = toCopy.lemmaValues.futurdubitativsing3encliticf;
    this.workingLemmaVersion.lemmaValues.futurdubitativplural1enclitic = toCopy.lemmaValues.futurdubitativplural1enclitic;
    this.workingLemmaVersion.lemmaValues.futurdubitativplural2enclitic = toCopy.lemmaValues.futurdubitativplural2enclitic;
    this.workingLemmaVersion.lemmaValues.futurdubitativplural3enclitic = toCopy.lemmaValues.futurdubitativplural3enclitic;

    this.setUpForm();
  }

  private triggerChangeDetectionForAutoSize() {
    // the autoresize check can't be triggered manually. But it reacts to resize events of the window.
    // thus, we dispatch that event to force autoresize to be triggered.
    window.dispatchEvent(new Event('resize'));
  }
}
