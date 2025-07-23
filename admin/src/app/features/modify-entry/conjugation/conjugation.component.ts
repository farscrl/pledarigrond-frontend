import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InflectionSubType } from 'src/app/models/inflection';
import { InflectionService } from 'src/app/services/inflection.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { Language } from "../../../models/security";
import { CopyService } from "../../../services/copy.service";
import { EditorService } from "../../../services/editor.service";
import { EnvironmentService } from "../../../services/environment.service";
import { EntryVersionInternalDto, Verb } from '../../../models/dictionary';

export class ConjugationData {
  version?: EntryVersionInternalDto;
}

@Component({
    selector: 'app-conjugation',
    templateUrl: './conjugation.component.html',
    styleUrls: ['./conjugation.component.scss'],
    standalone: false
})
export class ConjugationComponent implements OnInit {

  private version?: EntryVersionInternalDto;

  validateForm!: UntypedFormGroup;

  subTypes: InflectionSubType[] = [];

  working: Verb = new Verb();

  isRegular = true;

  constructor(
    private fb: UntypedFormBuilder,
    private inflectionService: InflectionService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
    public copyService: CopyService,
    public editorService: EditorService,
    public environmentService: EnvironmentService,
    @Inject(NZ_MODAL_DATA) data: ConjugationData
  ) {
    this.version = data.version;
    if (this.version) {
      this.working = JSON.parse(JSON.stringify(this.version.inflection?.verb || new Verb()));
    }
  }

  ngOnInit(): void {
    this.setUpForm();

    this.inflectionService.getInflectionSubtypes(this.languageSelectionService.getCurrentLanguage(), 'VERB').subscribe(value => {
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
    this.generateForms(this.validateForm.controls['inflectionSubtype'].value, this.validateForm.controls['infinitiv'].value);
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.working = JSON.parse(JSON.stringify(this.version!.inflection?.verb || new Verb()));
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
    return (language === Language.PUTER || language === Language.VALLADER || language === Language.SURSILVAN || language == Language.SUTSILVAN);
  }

  hasCundizionalIndirect(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.SUTSILVAN || language === Language.SURSILVAN);
  }

  hasExtendedImperativ(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.PUTER || language === Language.VALLADER);
  }

  hasComposedWithFields(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.PUTER || language === Language.VALLADER || language === Language.SURSILVAN);
  }

  hasPredicativ(): boolean {
    const language = this.languageSelectionService.getCurrentLanguage();
    return (language === Language.SURSILVAN);
  }

  copyConjugation() {
    this.copyService.copyConjugation(this.version!.entryId!, this.working.infinitiv!);
  }

  pasteConjugation() {
    if (!this.copyService.canPasteConjugation()) {
      return;
    }
    this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), this.copyService.entryId!).subscribe(entry => {
      this.copyVerbForms(entry.current!);
    });
  }

  triggerChangeDetectionForAutoSizeLater() {
    setTimeout(() => {
      this.triggerChangeDetectionForAutoSize();
    }, 150);
  }

  private returnValues() {
    this.working.infinitiv = this.validateForm.get('infinitiv')?.value;
    this.working.inflectionSubtype = this.validateForm.get('inflectionSubtype')?.value;
    this.working.irregular = this.validateForm.get('irregular')?.value;

    this.working.preschent = {
      sing1: this.validateForm.get('preschentsing1')?.value,
      sing2: this.validateForm.get('preschentsing2')?.value,
      sing3: this.validateForm.get('preschentsing3')?.value,
      plural1: this.validateForm.get('preschentplural1')?.value,
      plural2: this.validateForm.get('preschentplural2')?.value,
      plural3: this.validateForm.get('preschentplural3')?.value
    };

    this.working.imperfect = {
      sing1: this.validateForm.get('imperfectsing1')?.value,
      sing2: this.validateForm.get('imperfectsing2')?.value,
      sing3: this.validateForm.get('imperfectsing3')?.value,
      plural1: this.validateForm.get('imperfectplural1')?.value,
      plural2: this.validateForm.get('imperfectplural2')?.value,
      plural3: this.validateForm.get('imperfectplural3')?.value
    };

    this.working.conjunctiv = {
      sing1: this.validateForm.get('conjunctivsing1')?.value,
      sing2: this.validateForm.get('conjunctivsing2')?.value,
      sing3: this.validateForm.get('conjunctivsing3')?.value,
      plural1: this.validateForm.get('conjunctivplural1')?.value,
      plural2: this.validateForm.get('conjunctivplural2')?.value,
      plural3: this.validateForm.get('conjunctivplural3')?.value
    };

    this.working.conjunctivImperfect = {
      sing1: this.validateForm.get('conjunctiv2sing1')?.value,
      sing2: this.validateForm.get('conjunctiv2sing2')?.value,
      sing3: this.validateForm.get('conjunctiv2sing3')?.value,
      plural1: this.validateForm.get('conjunctiv2plural1')?.value,
      plural2: this.validateForm.get('conjunctiv2plural2')?.value,
      plural3: this.validateForm.get('conjunctiv2plural3')?.value
    };

    this.working.cundiziunal = {
      sing1: this.validateForm.get('cundizionalsing1')?.value,
      sing2: this.validateForm.get('cundizionalsing2')?.value,
      sing3: this.validateForm.get('cundizionalsing3')?.value,
      plural1: this.validateForm.get('cundizionalplural1')?.value,
      plural2: this.validateForm.get('cundizionalplural2')?.value,
      plural3: this.validateForm.get('cundizionalplural3')?.value
    };

    this.working.cundiziunalIndirect = {
      sing1: this.validateForm.get('cundizionalindirectsing1')?.value,
      sing2: this.validateForm.get('cundizionalindirectsing2')?.value,
      sing3: this.validateForm.get('cundizionalindirectsing3')?.value,
      plural1: this.validateForm.get('cundizionalindirectplural1')?.value,
      plural2: this.validateForm.get('cundizionalindirectplural2')?.value,
      plural3: this.validateForm.get('cundizionalindirectplural3')?.value
    }

    this.working.futur = {
      sing1: this.validateForm.get('futursing1')?.value,
      sing2: this.validateForm.get('futursing2')?.value,
      sing3: this.validateForm.get('futursing3')?.value,
      plural1: this.validateForm.get('futurplural1')?.value,
      plural2: this.validateForm.get('futurplural2')?.value,
      plural3: this.validateForm.get('futurplural3')?.value
    }

    this.working.futurDubitativ = {
      sing1: this.validateForm.get('futurdubitativsing1')?.value,
      sing2: this.validateForm.get('futurdubitativsing2')?.value,
      sing3: this.validateForm.get('futurdubitativsing3')?.value,
      plural1: this.validateForm.get('futurdubitativplural1')?.value,
      plural2: this.validateForm.get('futurdubitativplural2')?.value,
      plural3: this.validateForm.get('futurdubitativplural3')?.value
    }

    this.working.participPerfect = {
      ms: this.validateForm.get('participperfectms')?.value,
      fs: this.validateForm.get('participperfectfs')?.value,
      mp: this.validateForm.get('participperfectmp')?.value,
      fp: this.validateForm.get('participperfectfp')?.value,
      msPredicativ: this.validateForm.get('participperfectmspredicativ')?.value
    }

    this.working.imperativ = {
      singular: this.validateForm.get('imperativ1')?.value,
      plural: this.validateForm.get('imperativ2')?.value,
      form3: this.validateForm.get('imperativ3')?.value,
      form4: this.validateForm.get('imperativ4')?.value,
      form5: this.validateForm.get('imperativ5')?.value,
      form6: this.validateForm.get('imperativ6')?.value
    }

    this.working.gerundium = this.validateForm.get('gerundium')?.value;
    this.working.composedWith = this.validateForm.get('composedWith')?.value;

    this.working.preschentEnclitic = {
      sing1: this.validateForm.get('preschentsing1enclitic')?.value,
      sing2: this.validateForm.get('preschentsing2enclitic')?.value,
      sing3m: this.validateForm.get('preschentsing3encliticm')?.value,
      sing3f: this.validateForm.get('preschentsing3encliticf')?.value,
      plural1: this.validateForm.get('preschentplural1enclitic')?.value,
      plural2: this.validateForm.get('preschentplural2enclitic')?.value,
      plural3: this.validateForm.get('preschentplural3enclitic')?.value
    }

    this.working.imperfectEnclitic = {
      sing1: this.validateForm.get('imperfectsing1enclitic')?.value,
      sing2: this.validateForm.get('imperfectsing2enclitic')?.value,
      sing3m: this.validateForm.get('imperfectsing3encliticm')?.value,
      sing3f: this.validateForm.get('imperfectsing3encliticf')?.value,
      plural1: this.validateForm.get('imperfectplural1enclitic')?.value,
      plural2: this.validateForm.get('imperfectplural2enclitic')?.value,
      plural3: this.validateForm.get('imperfectplural3enclitic')?.value
    }

    this.working.cundizionalEnclitic = {
      sing1: this.validateForm.get('cundizionalsing1enclitic')?.value,
      sing2: this.validateForm.get('cundizionalsing2enclitic')?.value,
      sing3m: this.validateForm.get('cundizionalsing3encliticm')?.value,
      sing3f: this.validateForm.get('cundizionalsing3encliticf')?.value,
      plural1: this.validateForm.get('cundizionalplural1enclitic')?.value,
      plural2: this.validateForm.get('cundizionalplural2enclitic')?.value,
      plural3: this.validateForm.get('cundizionalplural3enclitic')?.value
    }

    this.working.futurEnclitic = {
      sing1: this.validateForm.get('futursing1enclitic')?.value,
      sing2: this.validateForm.get('futursing2enclitic')?.value,
      sing3m: this.validateForm.get('futursing3encliticm')?.value,
      sing3f: this.validateForm.get('futursing3encliticf')?.value,
      plural1: this.validateForm.get('futurplural1enclitic')?.value,
      plural2: this.validateForm.get('futurplural2enclitic')?.value,
      plural3: this.validateForm.get('futurplural3enclitic')?.value
    }

    this.working.futurDubitativEnclitic = {
      sing1: this.validateForm.get('futurdubitativsing1enclitic')?.value,
      sing2: this.validateForm.get('futurdubitativsing2enclitic')?.value,
      sing3m: this.validateForm.get('futurdubitativsing3encliticm')?.value,
      sing3f: this.validateForm.get('futurdubitativsing3encliticf')?.value,
      plural1: this.validateForm.get('futurdubitativplural1enclitic')?.value,
      plural2: this.validateForm.get('futurdubitativplural2enclitic')?.value,
      plural3: this.validateForm.get('futurdubitativplural3enclitic')?.value
    }

    this.modal.close(this.working);
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      infinitiv: new UntypedFormControl(this.working.infinitiv, Validators.required),
      inflectionSubtype: new UntypedFormControl(this.working.inflectionSubtype ? this.working.inflectionSubtype : ""),
      irregular: new UntypedFormControl(this.working.irregular ? this.working.irregular : false),

      preschentsing1: new UntypedFormControl(this.working.preschent?.sing1),
      preschentsing2: new UntypedFormControl(this.working.preschent?.sing2),
      preschentsing3: new UntypedFormControl(this.working.preschent?.sing3),
      preschentplural1: new UntypedFormControl(this.working.preschent?.plural1),
      preschentplural2: new UntypedFormControl(this.working.preschent?.plural2),
      preschentplural3: new UntypedFormControl(this.working.preschent?.plural3),

      imperfectsing1: new UntypedFormControl(this.working.imperfect?.sing1),
      imperfectsing2: new UntypedFormControl(this.working.imperfect?.sing2),
      imperfectsing3: new UntypedFormControl(this.working.imperfect?.sing3),
      imperfectplural1: new UntypedFormControl(this.working.imperfect?.plural1),
      imperfectplural2: new UntypedFormControl(this.working.imperfect?.plural2),
      imperfectplural3: new UntypedFormControl(this.working.imperfect?.plural3),

      conjunctivsing1: new UntypedFormControl(this.working.conjunctiv?.sing1),
      conjunctivsing2: new UntypedFormControl(this.working.conjunctiv?.sing2),
      conjunctivsing3: new UntypedFormControl(this.working.conjunctiv?.sing3),
      conjunctivplural1: new UntypedFormControl(this.working.conjunctiv?.plural1),
      conjunctivplural2: new UntypedFormControl(this.working.conjunctiv?.plural2),
      conjunctivplural3: new UntypedFormControl(this.working.conjunctiv?.plural3),

      conjunctiv2sing1: new UntypedFormControl(this.working.conjunctivImperfect?.sing1),
      conjunctiv2sing2: new UntypedFormControl(this.working.conjunctivImperfect?.sing2),
      conjunctiv2sing3: new UntypedFormControl(this.working.conjunctivImperfect?.sing3),
      conjunctiv2plural1: new UntypedFormControl(this.working.conjunctivImperfect?.plural1),
      conjunctiv2plural2: new UntypedFormControl(this.working.conjunctivImperfect?.plural2),
      conjunctiv2plural3: new UntypedFormControl(this.working.conjunctivImperfect?.plural3),

      cundizionalsing1: new UntypedFormControl(this.working.cundiziunal?.sing1),
      cundizionalsing2: new UntypedFormControl(this.working.cundiziunal?.sing2),
      cundizionalsing3: new UntypedFormControl(this.working.cundiziunal?.sing3),
      cundizionalplural1: new UntypedFormControl(this.working.cundiziunal?.plural1),
      cundizionalplural2: new UntypedFormControl(this.working.cundiziunal?.plural2),
      cundizionalplural3: new UntypedFormControl(this.working.cundiziunal?.plural3),

      cundizionalindirectsing1: new UntypedFormControl(this.working.cundiziunalIndirect?.sing1),
      cundizionalindirectsing2: new UntypedFormControl(this.working.cundiziunalIndirect?.sing2),
      cundizionalindirectsing3: new UntypedFormControl(this.working.cundiziunalIndirect?.sing3),
      cundizionalindirectplural1: new UntypedFormControl(this.working.cundiziunalIndirect?.plural1),
      cundizionalindirectplural2: new UntypedFormControl(this.working.cundiziunalIndirect?.plural2),
      cundizionalindirectplural3: new UntypedFormControl(this.working.cundiziunalIndirect?.plural3),

      futursing1: new UntypedFormControl(this.working.futur?.sing1),
      futursing2: new UntypedFormControl(this.working.futur?.sing2),
      futursing3: new UntypedFormControl(this.working.futur?.sing3),
      futurplural1: new UntypedFormControl(this.working.futur?.plural1),
      futurplural2: new UntypedFormControl(this.working.futur?.plural2),
      futurplural3: new UntypedFormControl(this.working.futur?.plural3),

      futurdubitativsing1: new UntypedFormControl(this.working.futurDubitativ?.sing1),
      futurdubitativsing2: new UntypedFormControl(this.working.futurDubitativ?.sing2),
      futurdubitativsing3: new UntypedFormControl(this.working.futurDubitativ?.sing3),
      futurdubitativplural1: new UntypedFormControl(this.working.futurDubitativ?.plural1),
      futurdubitativplural2: new UntypedFormControl(this.working.futurDubitativ?.plural2),
      futurdubitativplural3: new UntypedFormControl(this.working.futurDubitativ?.plural3),

      participperfectms: new UntypedFormControl(this.working.participPerfect?.ms),
      participperfectfs: new UntypedFormControl(this.working.participPerfect?.fs),
      participperfectmp: new UntypedFormControl(this.working.participPerfect?.mp),
      participperfectfp: new UntypedFormControl(this.working.participPerfect?.fp),
      participperfectmspredicativ: new UntypedFormControl(this.working.participPerfect?.msPredicativ),

      imperativ1: new UntypedFormControl(this.working.imperativ?.singular),
      imperativ2: new UntypedFormControl(this.working.imperativ?.plural),
      imperativ3: new UntypedFormControl(this.working.imperativ?.form3),
      imperativ4: new UntypedFormControl(this.working.imperativ?.form4),
      imperativ5: new UntypedFormControl(this.working.imperativ?.form5),
      imperativ6: new UntypedFormControl(this.working.imperativ?.form6),

      gerundium: new UntypedFormControl(this.working.gerundium),
      composedWith: new UntypedFormControl(this.working.composedWith),

      preschentsing1enclitic: new UntypedFormControl(this.working.preschentEnclitic?.sing1),
      preschentsing2enclitic: new UntypedFormControl(this.working.preschentEnclitic?.sing2),
      preschentsing3encliticm: new UntypedFormControl(this.working.preschentEnclitic?.sing3m),
      preschentsing3encliticf: new UntypedFormControl(this.working.preschentEnclitic?.sing3f),
      preschentplural1enclitic: new UntypedFormControl(this.working.preschentEnclitic?.plural1),
      preschentplural2enclitic: new UntypedFormControl(this.working.preschentEnclitic?.plural2),
      preschentplural3enclitic: new UntypedFormControl(this.working.preschentEnclitic?.plural3),

      imperfectsing1enclitic: new UntypedFormControl(this.working.imperfectEnclitic?.sing1),
      imperfectsing2enclitic: new UntypedFormControl(this.working.imperfectEnclitic?.sing2),
      imperfectsing3encliticm: new UntypedFormControl(this.working.imperfectEnclitic?.sing3m),
      imperfectsing3encliticf: new UntypedFormControl(this.working.imperfectEnclitic?.sing3f),
      imperfectplural1enclitic: new UntypedFormControl(this.working.imperfectEnclitic?.plural1),
      imperfectplural2enclitic: new UntypedFormControl(this.working.imperfectEnclitic?.plural2),
      imperfectplural3enclitic: new UntypedFormControl(this.working.imperfectEnclitic?.plural3),

      cundizionalsing1enclitic: new UntypedFormControl(this.working.cundizionalEnclitic?.sing1),
      cundizionalsing2enclitic: new UntypedFormControl(this.working.cundizionalEnclitic?.sing2),
      cundizionalsing3encliticm: new UntypedFormControl(this.working.cundizionalEnclitic?.sing3m),
      cundizionalsing3encliticf: new UntypedFormControl(this.working.cundizionalEnclitic?.sing3f),
      cundizionalplural1enclitic: new UntypedFormControl(this.working.cundizionalEnclitic?.plural1),
      cundizionalplural2enclitic: new UntypedFormControl(this.working.cundizionalEnclitic?.plural2),
      cundizionalplural3enclitic: new UntypedFormControl(this.working.cundizionalEnclitic?.plural3),

      futursing1enclitic: new UntypedFormControl(this.working.futurEnclitic?.sing1),
      futursing2enclitic: new UntypedFormControl(this.working.futurEnclitic?.sing2),
      futursing3encliticm: new UntypedFormControl(this.working.futurEnclitic?.sing3m),
      futursing3encliticf: new UntypedFormControl(this.working.futurEnclitic?.sing3f),
      futurplural1enclitic: new UntypedFormControl(this.working.futurEnclitic?.plural1),
      futurplural2enclitic: new UntypedFormControl(this.working.futurEnclitic?.plural2),
      futurplural3enclitic: new UntypedFormControl(this.working.futurEnclitic?.plural3),

      futurdubitativsing1enclitic: new UntypedFormControl(this.working.futurDubitativEnclitic?.sing1),
      futurdubitativsing2enclitic: new UntypedFormControl(this.working.futurDubitativEnclitic?.sing2),
      futurdubitativsing3encliticm: new UntypedFormControl(this.working.futurDubitativEnclitic?.sing3m),
      futurdubitativsing3encliticf: new UntypedFormControl(this.working.futurDubitativEnclitic?.sing3f),
      futurdubitativplural1enclitic: new UntypedFormControl(this.working.futurDubitativEnclitic?.plural1),
      futurdubitativplural2enclitic: new UntypedFormControl(this.working.futurDubitativEnclitic?.plural2),
      futurdubitativplural3enclitic: new UntypedFormControl(this.working.futurDubitativEnclitic?.plural3),
    });

    this.validateForm.get("irregular")!.valueChanges.subscribe(value => {
      this.isRegular = !value;
    });

    this.triggerChangeDetectionForAutoSizeLater();
  }

  private generateForms(subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'VERB', subTypeId, baseForm).subscribe(inflection => {
      this.working = inflection.verb!;
      this.isRegular = true;
      this.setUpForm();
    });
  }

  private shouldGuessInflectionSubtype(): boolean {
    if (
      this.working.preschent?.sing1 ||
      this.working.preschent?.sing2 ||
      this.working.preschent?.sing3 ||
      this.working.preschent?.plural1 ||
      this.working.preschent?.plural2 ||
      this.working.preschent?.plural3 ||

      this.working.imperfect?.sing1 ||
      this.working.imperfect?.sing2 ||
      this.working.imperfect?.sing3 ||
      this.working.imperfect?.plural1 ||
      this.working.imperfect?.plural2 ||
      this.working.imperfect?.plural3 ||

      this.working.conjunctiv?.sing1 ||
      this.working.conjunctiv?.sing2 ||
      this.working.conjunctiv?.sing3 ||
      this.working.conjunctiv?.plural1 ||
      this.working.conjunctiv?.plural2 ||
      this.working.conjunctiv?.plural3 ||

      this.working.conjunctivImperfect?.sing1 ||
      this.working.conjunctivImperfect?.sing2 ||
      this.working.conjunctivImperfect?.sing3 ||
      this.working.conjunctivImperfect?.plural1 ||
      this.working.conjunctivImperfect?.plural2 ||
      this.working.conjunctivImperfect?.plural3 ||

      this.working.cundiziunal?.sing1 ||
      this.working.cundiziunal?.sing2 ||
      this.working.cundiziunal?.sing3 ||
      this.working.cundiziunal?.plural1 ||
      this.working.cundiziunal?.plural2 ||
      this.working.cundiziunal?.plural3 ||

      this.working.cundiziunalIndirect?.sing1 ||
      this.working.cundiziunalIndirect?.sing2 ||
      this.working.cundiziunalIndirect?.sing3 ||
      this.working.cundiziunalIndirect?.plural1 ||
      this.working.cundiziunalIndirect?.plural2 ||
      this.working.cundiziunalIndirect?.plural3 ||

      this.working.futur?.sing1 ||
      this.working.futur?.sing2 ||
      this.working.futur?.sing3 ||
      this.working.futur?.plural1 ||
      this.working.futur?.plural2 ||
      this.working.futur?.plural3 ||

      this.working.futurDubitativ?.sing1 ||
      this.working.futurDubitativ?.sing2 ||
      this.working.futurDubitativ?.sing3 ||
      this.working.futurDubitativ?.plural1 ||
      this.working.futurDubitativ?.plural2 ||
      this.working.futurDubitativ?.plural3 ||

      this.working.participPerfect?.ms ||
      this.working.participPerfect?.fs ||
      this.working.participPerfect?.mp ||
      this.working.participPerfect?.fp ||
      this.working.participPerfect?.msPredicativ ||

      this.working.imperativ?.singular ||
      this.working.imperativ?.plural ||
      this.working.imperativ?.form3 ||
      this.working.imperativ?.form4 ||
      this.working.imperativ?.form5 ||
      this.working.imperativ?.form6 ||

      this.working.gerundium ||
      this.working.composedWith ||

      this.working.preschentEnclitic?.sing1 ||
      this.working.preschentEnclitic?.sing2 ||
      this.working.preschentEnclitic?.sing3m ||
      this.working.preschentEnclitic?.sing3f ||
      this.working.preschentEnclitic?.plural1 ||
      this.working.preschentEnclitic?.plural2 ||
      this.working.preschentEnclitic?.plural3 ||

      this.working.imperfectEnclitic?.sing1 ||
      this.working.imperfectEnclitic?.sing2 ||
      this.working.imperfectEnclitic?.sing3m ||
      this.working.imperfectEnclitic?.sing3f ||
      this.working.imperfectEnclitic?.plural1 ||
      this.working.imperfectEnclitic?.plural2 ||
      this.working.imperfectEnclitic?.plural3 ||

      this.working.cundizionalEnclitic?.sing1 ||
      this.working.cundizionalEnclitic?.sing2 ||
      this.working.cundizionalEnclitic?.sing3m ||
      this.working.cundizionalEnclitic?.sing3f ||
      this.working.cundizionalEnclitic?.plural1 ||
      this.working.cundizionalEnclitic?.plural2 ||
      this.working.cundizionalEnclitic?.plural3 ||

      this.working.futurEnclitic?.sing1 ||
      this.working.futurEnclitic?.sing2 ||
      this.working.futurEnclitic?.sing3m ||
      this.working.futurEnclitic?.sing3f ||
      this.working.futurEnclitic?.plural1 ||
      this.working.futurEnclitic?.plural2 ||
      this.working.futurEnclitic?.plural3 ||

      this.working.futurDubitativEnclitic?.sing1 ||
      this.working.futurDubitativEnclitic?.sing2 ||
      this.working.futurDubitativEnclitic?.sing3m ||
      this.working.futurDubitativEnclitic?.sing3f ||
      this.working.futurDubitativEnclitic?.plural1 ||
      this.working.futurDubitativEnclitic?.plural2 ||
      this.working.futurDubitativEnclitic?.plural3
    ) {
      return false;
    }
    return true;
  }

  private guessInflectionSubtype() {
    const baseForm = this.working.infinitiv ? this.working.infinitiv : this.version?.rmStichwort ? this.version.rmStichwort : "";
    if (baseForm === "") {
      console.log("No base form defined, guessing impossible");
      return;
    }

    const genus = this.version?.rmGenus;
    const flex = this.version?.rmFlex;
    this.inflectionService.guessInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'VERB', baseForm, genus, flex).subscribe(inflection => {
      // for short words the guessing can be empty -> just ignore empty response
      if (!inflection) {
        return;
      }
      this.isRegular = true;
      this.working = inflection.verb!;
      this.setUpForm();
    });
  }

  private copyVerbForms(toCopy: EntryVersionInternalDto) {
    const valuesToCopy = toCopy.inflection!.verb!;

    this.working.infinitiv = valuesToCopy.infinitiv;
    this.working.inflectionSubtype = valuesToCopy.inflectionSubtype;
    this.working.irregular = valuesToCopy.irregular;

    this.working.preschent = {
      sing1: valuesToCopy.preschent?.sing1,
      sing2: valuesToCopy.preschent?.sing2,
      sing3: valuesToCopy.preschent?.sing3,
      plural1: valuesToCopy.preschent?.plural1,
      plural2: valuesToCopy.preschent?.plural2,
      plural3: valuesToCopy.preschent?.plural3
    }

    this.working.imperfect = {
      sing1: valuesToCopy.imperfect?.sing1,
      sing2: valuesToCopy.imperfect?.sing2,
      sing3: valuesToCopy.imperfect?.sing3,
      plural1: valuesToCopy.imperfect?.plural1,
      plural2: valuesToCopy.imperfect?.plural2,
      plural3: valuesToCopy.imperfect?.plural3
    };

    this.working.conjunctiv = {
      sing1: valuesToCopy.conjunctiv?.sing1,
      sing2: valuesToCopy.conjunctiv?.sing2,
      sing3: valuesToCopy.conjunctiv?.sing3,
      plural1: valuesToCopy.conjunctiv?.plural1,
      plural2: valuesToCopy.conjunctiv?.plural2,
      plural3: valuesToCopy.conjunctiv?.plural3
    }

    this.working.conjunctivImperfect = {
      sing1: valuesToCopy.conjunctivImperfect?.sing1,
      sing2: valuesToCopy.conjunctivImperfect?.sing2,
      sing3: valuesToCopy.conjunctivImperfect?.sing3,
      plural1: valuesToCopy.conjunctivImperfect?.plural1,
      plural2: valuesToCopy.conjunctivImperfect?.plural2,
      plural3: valuesToCopy.conjunctivImperfect?.plural3
    }

    this.working.cundiziunal = {
      sing1: valuesToCopy.cundiziunal?.sing1,
      sing2: valuesToCopy.cundiziunal?.sing2,
      sing3: valuesToCopy.cundiziunal?.sing3,
      plural1: valuesToCopy.cundiziunal?.plural1,
      plural2: valuesToCopy.cundiziunal?.plural2,
      plural3: valuesToCopy.cundiziunal?.plural3
    };

    this.working.cundiziunalIndirect = {
      sing1: valuesToCopy.cundiziunalIndirect?.sing1,
      sing2: valuesToCopy.cundiziunalIndirect?.sing2,
      sing3: valuesToCopy.cundiziunalIndirect?.sing3,
      plural1: valuesToCopy.cundiziunalIndirect?.plural1,
      plural2: valuesToCopy.cundiziunalIndirect?.plural2,
      plural3: valuesToCopy.cundiziunalIndirect?.plural3
    };

    this.working.futur = {
      sing1: valuesToCopy.futur?.sing1,
      sing2: valuesToCopy.futur?.sing2,
      sing3: valuesToCopy.futur?.sing3,
      plural1: valuesToCopy.futur?.plural1,
      plural2: valuesToCopy.futur?.plural2,
      plural3: valuesToCopy.futur?.plural3
    };

    this.working.futurDubitativ = {
      sing1: valuesToCopy.futurDubitativ?.sing1,
      sing2: valuesToCopy.futurDubitativ?.sing2,
      sing3: valuesToCopy.futurDubitativ?.sing3,
      plural1: valuesToCopy.futurDubitativ?.plural1,
      plural2: valuesToCopy.futurDubitativ?.plural2,
      plural3: valuesToCopy.futurDubitativ?.plural3
    };

    this.working.participPerfect = {
      ms: valuesToCopy.participPerfect?.ms,
      fs: valuesToCopy.participPerfect?.fs,
      mp: valuesToCopy.participPerfect?.mp,
      fp: valuesToCopy.participPerfect?.fp,
      msPredicativ: valuesToCopy.participPerfect?.msPredicativ
    };

    this.working.imperativ = {
      singular: valuesToCopy.imperativ?.singular,
      plural: valuesToCopy.imperativ?.plural,
      form3: valuesToCopy.imperativ?.form3,
      form4: valuesToCopy.imperativ?.form4,
      form5: valuesToCopy.imperativ?.form5,
      form6: valuesToCopy.imperativ?.form6
    };

    this.working.gerundium = valuesToCopy.gerundium;

    this.working.composedWith = valuesToCopy.composedWith;

    this.working.preschentEnclitic = {
      sing1: valuesToCopy.preschentEnclitic?.sing1,
      sing2: valuesToCopy.preschentEnclitic?.sing2,
      sing3m: valuesToCopy.preschentEnclitic?.sing3m,
      sing3f: valuesToCopy.preschentEnclitic?.sing3f,
      plural1: valuesToCopy.preschentEnclitic?.plural1,
      plural2: valuesToCopy.preschentEnclitic?.plural2,
      plural3: valuesToCopy.preschentEnclitic?.plural3
    };

    this.working.imperfectEnclitic = {
      sing1: valuesToCopy.imperfectEnclitic?.sing1,
      sing2: valuesToCopy.imperfectEnclitic?.sing2,
      sing3m: valuesToCopy.imperfectEnclitic?.sing3m,
      sing3f: valuesToCopy.imperfectEnclitic?.sing3f,
      plural1: valuesToCopy.imperfectEnclitic?.plural1,
      plural2: valuesToCopy.imperfectEnclitic?.plural2,
      plural3: valuesToCopy.imperfectEnclitic?.plural3
    };

    this.working.cundizionalEnclitic = {
      sing1: valuesToCopy.cundizionalEnclitic?.sing1,
      sing2: valuesToCopy.cundizionalEnclitic?.sing2,
      sing3m: valuesToCopy.cundizionalEnclitic?.sing3m,
      sing3f: valuesToCopy.cundizionalEnclitic?.sing3f,
      plural1: valuesToCopy.cundizionalEnclitic?.plural1,
      plural2: valuesToCopy.cundizionalEnclitic?.plural2,
      plural3: valuesToCopy.cundizionalEnclitic?.plural3
    };

    this.working.futurEnclitic = {
      sing1: valuesToCopy.futurEnclitic?.sing1,
      sing2: valuesToCopy.futurEnclitic?.sing2,
      sing3m: valuesToCopy.futurEnclitic?.sing3m,
      sing3f: valuesToCopy.futurEnclitic?.sing3f,
      plural1: valuesToCopy.futurEnclitic?.plural1,
      plural2: valuesToCopy.futurEnclitic?.plural2,
      plural3: valuesToCopy.futurEnclitic?.plural3
    };

    this.working.futurDubitativEnclitic = {
      sing1: valuesToCopy.futurDubitativEnclitic?.sing1,
      sing2: valuesToCopy.futurDubitativEnclitic?.sing2,
      sing3m: valuesToCopy.futurDubitativEnclitic?.sing3m,
      sing3f: valuesToCopy.futurDubitativEnclitic?.sing3f,
      plural1: valuesToCopy.futurDubitativEnclitic?.plural1,
      plural2: valuesToCopy.futurDubitativEnclitic?.plural2,
      plural3: valuesToCopy.futurDubitativEnclitic?.plural3
    };

    this.setUpForm();
  }

  private triggerChangeDetectionForAutoSize() {
    // the autoresize check can't be triggered manually. But it reacts to resize events of the window.
    // thus, we dispatch that event to force autoresize to be triggered.
    window.dispatchEvent(new Event('resize'));
  }
}
