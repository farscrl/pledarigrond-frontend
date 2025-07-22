import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pronouns } from '../../../../models/pronouns';
import { Idiom } from '../../../../services/selected-language.service';

import { ConjugationPersonalComponent } from './conjugation-personal/conjugation-personal.component';
import { ConjugationImpersonalComponent } from './conjugation-impersonal/conjugation-impersonal.component';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../../models/dictionary';

@Component({
    selector: 'app-details-verb',
    templateUrl: './details-verb.component.html',
    styleUrl: './details-verb.component.scss',
    imports: [ConjugationPersonalComponent, ConjugationImpersonalComponent, TranslatePipe]
})
export class DetailsVerbComponent implements OnChanges {
  @Input()
  version?: EntryVersionDto;
  versionCopy?: EntryVersionDto;

  @Input()
  idiom?: Idiom;

  public pronouns = new Pronouns();

  public areEncliticEnabled = false;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['version'] || ! changes['version'].currentValue) {
      return;
    }
    this.versionCopy = JSON.parse(JSON.stringify(this.version));
    console.log(this.versionCopy);
    this.definePronouns();
  }

  toggleEnclitic() {
    this.areEncliticEnabled = !this.areEncliticEnabled;
  }

  hasConjunctiv2(): boolean {
    return (this.idiom === 'puter' || this.idiom === 'vallader' || this.idiom === 'sursilv' || this.idiom == 'sutsilv');
  }

  hasCundizionalIndirect(): boolean {
    return (this.idiom === 'sutsilv' || this.idiom === 'sursilv');
  }

  hasFuturDubitativ(): boolean {
    return (this.idiom === 'puter');
  }

  hasPredicativ(): boolean {
    return (this.idiom === 'sursilv');
  }

  hasEncliticForms(): boolean {
    return this.idiom === 'surmiran' || this.idiom === 'sutsilv' || this.idiom === 'puter' || this.idiom === 'vallader';
  }

  hasEncliticFutur(): boolean {
    return (this.idiom === 'surmiran' || this.idiom === 'puter' || this.idiom === 'vallader');
  }

  hasEncliticFuturDubitativ(): boolean {
    return (this.idiom === 'puter');
  }

  private definePronouns() {
    switch (this.idiom!) {
      case 'rumgr':
        const ppRumGrConj = ["che jau ", "che ti ", "ch'el/ella ", "che nus ", "che vus ", "ch'els/ellas ", "ch'i ", "ch'igl"];
        const ppRumGr = ["jau ", "ti ", "el/ella ", "nus ", "vus ", "els/ellas ", "i ", "igl ", ""]; // 1sg, 2sg, 3sg, 1pl, 2pl, 3pl, inpers, inpersVowel, Vallder2pl
        const ppRumGrRefl = ["ma ", "ta ", "sa ", "ans ", "as ", "sa ", "", ""];
        const ppRumGrReflVowel = ["m'", "t'", "s'", "ans ", "as ", "s'", "", ""];
        this.extractPronouns(ppRumGrConj, ppRumGr, ppRumGrRefl, ppRumGrReflVowel);
        break;
      case 'sutsilv':
        const ppSutsilvConj = ["ca jou ", "ca tei ", "c'el/ella ", "ca nus ", "ca vus ", "c'els/ellas ", "c'i ", "c'igl"];
        const ppSutsilv = ["jou ", "tei ", "el/ella ", "nus ", "vus ", "els/ellas ", "i ", "igl ", ""];
        const ppSutsilvRefl = ["ma ", "ta ", "sa ", "ans ", "as ", "sa ", "", ""];
        const ppSutsilvReflVowel = ["m'", "t'", "s'", "ans ", "as ", "s'", "", ""];
        this.extractPronouns(ppSutsilvConj, ppSutsilv, ppSutsilvRefl, ppSutsilvReflVowel);
        break;
      case 'surmiran':
        const ppSurmConj = ["tg'ia ", "tgi te ", "tg'el/ella ", "tgi nous ", "tgi vous ", "tg'els/ellas ", "tg'i ", "tg'igl"];
        const ppSurm = ["ia ", "te ", "el/ella ", "nous ", "vous ", "els/ellas ", "i ", "igl ", ""];
        const ppSurmRefl = ["ma ", "ta ", "sa ", "ans ", "az ", "sa ", "", ""];
        const ppSurmReflVowel = ["m'", "t'", "s'", "ans ", "az ", "s'", "", ""];
        this.extractPronouns(ppSurmConj, ppSurm, ppSurmRefl, ppSurmReflVowel);
        break;
      case 'puter':
        const ppPuterConj = ["ch'eau ", "cha tü ", "ch'el/ella ", "cha nus ", "cha vus ", "ch'els/ellas ", "ch'que ", "cha que"];
        const ppPuter = ["eau ", "tü ", "el/ella ", "nus ", "vus ", "els/ellas ", "a/que ", "a/que ", ""];
        const ppPuterRefl = ["am ", "at ", "as ", "ans ", "as ", "as ", "", ""];
        const ppPuterReflVowel = ["m'", "t'", "s'", "ans ", "s'", "s'", "", ""];
        this.extractPronouns(ppPuterConj, ppPuter, ppPuterRefl, ppPuterReflVowel);
        break;
      case 'vallader':
        const ppVallConj = ["ch'eu ", "cha tü ", "ch'el/ella ", "cha nus ", "cha vus ", "ch'els/ellas ", "ch'i ", "ch'igl"];
        const ppVall = ["eu ", "tü ", "el/ella ", "nus ", "vus ", "els/ellas ", "i ", "igl ", "vo "];
        const ppVallRefl = ["am ", "at ", "as ", "ans ", "as ", "as ", "", ""];
        const ppVallReflVowel = ["m'", "t'", "s'", "ans ", "s'", "s'", "", ""];
        this.extractPronouns(ppVallConj, ppVall, ppVallRefl, ppVallReflVowel);
        break;
      case 'sursilv':
        // TODO
        break;
      default:
      // do nothing
    }
  }

  private extractPronouns(ppConj: string[], pp: string[], ppRefl: string[], ppReflVowel: string[]) {
    if (!this.versionCopy) {
      return;
    }
    this.versionCopy.inflection = this.versionCopy.inflection || {};
    this.versionCopy.inflection.verb = this.versionCopy.inflection.verb || {};
    this.versionCopy.inflection.verb.preschent = this.versionCopy.inflection.verb.preschent || {};
    this.versionCopy.inflection.verb.imperfect = this.versionCopy.inflection.verb.imperfect || {};
    this.versionCopy.inflection.verb.conjunctiv = this.versionCopy.inflection.verb.conjunctiv || {};
    this.versionCopy.inflection.verb.conjunctiv2 = this.versionCopy.inflection.verb.conjunctiv2 || {};
    this.versionCopy.inflection.verb.cundiziunal = this.versionCopy.inflection.verb.cundiziunal || {};
    this.versionCopy.inflection.verb.cundiziunalIndirect = this.versionCopy.inflection.verb.cundiziunalIndirect || {};
    this.versionCopy.inflection.verb.futur = this.versionCopy.inflection.verb.futur || {};
    this.versionCopy.inflection.verb.futurDubitativ = this.versionCopy.inflection.verb.futurDubitativ || {};
    this.versionCopy.inflection.verb.preschentEnclitic = this.versionCopy.inflection.verb.preschentEnclitic || {};
    this.versionCopy.inflection.verb.imperfectEnclitic = this.versionCopy.inflection.verb.imperfectEnclitic || {};
    this.versionCopy.inflection.verb.cundizionalEnclitic = this.versionCopy.inflection.verb.cundizionalEnclitic || {};
    this.versionCopy.inflection.verb.futurEnclitic = this.versionCopy.inflection.verb.futurEnclitic || {};
    this.versionCopy.inflection.verb.futurDubitativEnclitic = this.versionCopy.inflection.verb.futurDubitativEnclitic || {};

    [this.versionCopy.inflection!.verb!.preschent!.sing1, this.pronouns.preschentsing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschent?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.imperfect!.sing1, this.pronouns.imperfectsing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfect?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.conjunctiv!.sing1, this.pronouns.conjunctivsing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.conjunctiv2!.sing1, this.pronouns.conjunctiv2sing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv2?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundiziunal!.sing1, this.pronouns.cundizionalsing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunal?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundiziunalIndirect!.sing1, this.pronouns.cundizionalindirectsing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunalIndirect?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futur!.sing1, this.pronouns.futursing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futur?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurDubitativ!.sing1, this.pronouns.futurdubitativsing1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativ?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.sing1, this.pronouns.preschentsing1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.sing1, this.pronouns.imperfectsing1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.sing1, this.pronouns.cundizionalsing1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.sing1, this.pronouns.futursing1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.sing1, this.pronouns.futurdubitativsing1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);

    [this.versionCopy.inflection!.verb!.preschent!.sing2, this.pronouns.preschentsing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschent?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.imperfect!.sing2, this.pronouns.imperfectsing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfect?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.conjunctiv!.sing2, this.pronouns.conjunctivsing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.conjunctiv2!.sing2, this.pronouns.conjunctiv2sing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv2?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.cundiziunal!.sing2, this.pronouns.cundizionalsing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunal?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.cundiziunalIndirect!.sing2, this.pronouns.cundizionalindirectsing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunalIndirect?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.futur!.sing2, this.pronouns.futursing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futur?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.futurDubitativ!.sing2, this.pronouns.futurdubitativsing2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativ?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.sing2, this.pronouns.preschentsing2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.sing2, this.pronouns.imperfectsing2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.sing2, this.pronouns.cundizionalsing2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.sing2, this.pronouns.futursing2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.sing2, this.pronouns.futurdubitativsing2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);

    [this.versionCopy.inflection!.verb!.preschent!.sing3, this.pronouns.preschentsing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschent?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.imperfect!.sing3, this.pronouns.imperfectsing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfect?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.conjunctiv!.sing3, this.pronouns.conjunctivsing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.conjunctiv2!.sing3, this.pronouns.conjunctiv2sing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv2?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundiziunal!.sing3, this.pronouns.cundizionalsing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunal?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundiziunalIndirect!.sing3, this.pronouns.cundizionalindirectsing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunalIndirect?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futur!.sing3, this.pronouns.futursing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futur?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurDubitativ!.sing3, this.pronouns.futurdubitativsing3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativ?.sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.sing3m, this.pronouns.preschentsing3encliticm] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic?.sing3m, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.sing3f, this.pronouns.preschentsing3encliticf] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic?.sing3f, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.sing3m, this.pronouns.imperfectsing3encliticm] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.sing3m, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.sing3f, this.pronouns.imperfectsing3encliticf] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.sing3f, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.sing3m, this.pronouns.cundizionalsing3encliticm] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.sing3m, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.sing3f, this.pronouns.cundizionalsing3encliticf] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.sing3f, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.sing3m, this.pronouns.futursing3encliticm] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.sing3m, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.sing3f, this.pronouns.futursing3encliticf] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.sing3f, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.sing3m, this.pronouns.futurdubitativsing3encliticm] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.sing3m, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.sing3f, this.pronouns.futurdubitativsing3encliticf] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.sing3f, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);

    [this.versionCopy.inflection!.verb!.preschent!.plural1, this.pronouns.preschentplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschent?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.imperfect!.plural1, this.pronouns.imperfectplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfect?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.conjunctiv!.plural1, this.pronouns.conjunctivplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.conjunctiv2!.plural1, this.pronouns.conjunctiv2plural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv2?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.cundiziunal!.plural1, this.pronouns.cundizionalplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunal?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.cundiziunalIndirect!.plural1, this.pronouns.cundizionalindirectplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunalIndirect?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.futur!.plural1, this.pronouns.futurplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futur?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.futurDubitativ!.plural1, this.pronouns.futurdubitativplural1] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativ?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.plural1, this.pronouns.preschentplural1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.plural1, this.pronouns.imperfectplural1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.plural1, this.pronouns.cundizionalplural1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.plural1, this.pronouns.futurplural1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.plural1, this.pronouns.futurdubitativplural1enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);

    [this.versionCopy.inflection!.verb!.preschent!.plural2, this.pronouns.preschentplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschent?.plural2, [ppConj[4], pp[4], pp[8], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.imperfect!.plural2, this.pronouns.imperfectplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfect?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.conjunctiv!.plural2, this.pronouns.conjunctivplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.conjunctiv2!.plural2, this.pronouns.conjunctiv2plural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv2?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.cundiziunal!.plural2, this.pronouns.cundizionalplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunal?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.cundiziunalIndirect!.plural2, this.pronouns.cundizionalindirectplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunalIndirect?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.futur!.plural2, this.pronouns.futurplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futur?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.futurDubitativ!.plural2, this.pronouns.futurdubitativplural2] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativ?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.plural2, this.pronouns.preschentplural2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic!.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.plural2, this.pronouns.imperfectplural2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.plural2, this.pronouns.cundizionalplural2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.plural2, this.pronouns.futurplural2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.plural2, this.pronouns.futurdubitativplural2enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);

    [this.versionCopy.inflection!.verb!.preschent!.plural3, this.pronouns.preschentplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschent?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.imperfect!.plural3, this.pronouns.imperfectplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfect?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.conjunctiv!.plural3, this.pronouns.conjunctivplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.conjunctiv2!.plural3, this.pronouns.conjunctiv2plural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.conjunctiv2?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.cundiziunal!.plural3, this.pronouns.cundizionalplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunal?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.cundiziunalIndirect!.plural3, this.pronouns.cundizionalindirectplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundiziunalIndirect?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.futur!.plural3, this.pronouns.futurplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futur?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.futurDubitativ!.plural3, this.pronouns.futurdubitativplural3] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativ?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.preschentEnclitic!.plural3, this.pronouns.preschentplural3enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.preschentEnclitic?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.imperfectEnclitic!.plural3, this.pronouns.imperfectplural3enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.imperfectEnclitic?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.cundizionalEnclitic!.plural3, this.pronouns.cundizionalplural3enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.cundizionalEnclitic?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.futurEnclitic!.plural3, this.pronouns.futurplural3enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurEnclitic?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.versionCopy.inflection!.verb!.futurDubitativEnclitic!.plural3, this.pronouns.futurdubitativplural3enclitic] = this.extractPrefixes(this.versionCopy.inflection!.verb!.futurDubitativEnclitic?.plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
  }

  private extractPrefixes(form: string|undefined, prefixCandidates: string[]): string[] {
    if (!form) {
      return [""];
    }
    const lines = form.split(/\r?\n/);
    let prefixes: string[] = [];
    let forms: string[] = [];

    lines.forEach((line, index) => {
      const prefix: string[] = [];
      prefixCandidates.forEach(candidate => {
        if (line.startsWith(candidate)) {
          prefix.push(candidate);
          line = line.replace(candidate, "");
        }
      });
      forms.push(line);
      prefixes.push(prefix.join(" "));
    });

    return [forms.join("\n"), prefixes.join("\n")];
  }

}
