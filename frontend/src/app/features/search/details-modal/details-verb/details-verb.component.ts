import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pronouns } from '../../../../models/pronouns';
import { Idiom } from '../../../../services/selected-language.service';
import { LemmaVersion } from '../../../../models/lemma-version';

@Component({
  selector: 'app-details-verb',
  templateUrl: './details-verb.component.html',
  styleUrl: './details-verb.component.scss'
})
export class DetailsVerbComponent implements OnChanges {
  @Input()
  lemmaVersion?: LemmaVersion;
  lemmaCopy?: LemmaVersion;

  @Input()
  idiom?: Idiom;

  public pronouns = new Pronouns();

  public areEncliticEnabled = false;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['lemmaVersion'] || ! changes['lemmaVersion'].currentValue) {
      return;
    }
    this.lemmaCopy = JSON.parse(JSON.stringify(this.lemmaVersion));
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
    if (!this.lemmaCopy) {
      return;
    }
    [this.lemmaCopy.lemmaValues.preschentsing1, this.pronouns.preschentsing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.preschentsing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.imperfectsing1, this.pronouns.imperfectsing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.imperfectsing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.conjunctivsing1, this.pronouns.conjunctivsing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctivsing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.conjunctiv2sing1, this.pronouns.conjunctiv2sing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctiv2sing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.cundizionalsing1, this.pronouns.cundizionalsing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalsing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.cundizionalindirectsing1, this.pronouns.cundizionalindirectsing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalindirectsing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.futursing1, this.pronouns.futursing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futursing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.futurdubitativsing1, this.pronouns.futurdubitativsing1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurdubitativsing1, [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);

    [this.lemmaCopy.lemmaValues.preschentsing2, this.pronouns.preschentsing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.preschentsing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.imperfectsing2, this.pronouns.imperfectsing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.imperfectsing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.conjunctivsing2, this.pronouns.conjunctivsing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctivsing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.conjunctiv2sing2, this.pronouns.conjunctiv2sing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctiv2sing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.cundizionalsing2, this.pronouns.cundizionalsing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalsing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.cundizionalindirectsing2, this.pronouns.cundizionalindirectsing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalindirectsing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.futursing2, this.pronouns.futursing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futursing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemmaCopy.lemmaValues.futurdubitativsing2, this.pronouns.futurdubitativsing2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurdubitativsing2, [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);

    [this.lemmaCopy.lemmaValues.preschentsing3, this.pronouns.preschentsing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.preschentsing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.imperfectsing3, this.pronouns.imperfectsing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.imperfectsing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.conjunctivsing3, this.pronouns.conjunctivsing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctivsing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.conjunctiv2sing3, this.pronouns.conjunctiv2sing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctiv2sing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.cundizionalsing3, this.pronouns.cundizionalsing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalsing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.cundizionalindirectsing3, this.pronouns.cundizionalindirectsing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalindirectsing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.futursing3, this.pronouns.futursing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futursing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemmaCopy.lemmaValues.futurdubitativsing3, this.pronouns.futurdubitativsing3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurdubitativsing3, [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);

    [this.lemmaCopy.lemmaValues.preschentplural1, this.pronouns.preschentplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.preschentplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.imperfectplural1, this.pronouns.imperfectplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.imperfectplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.conjunctivplural1, this.pronouns.conjunctivplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctivplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.conjunctiv2plural1, this.pronouns.conjunctiv2plural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctiv2plural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.cundizionalplural1, this.pronouns.cundizionalplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.cundizionalindirectplural1, this.pronouns.cundizionalindirectplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalindirectplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.futurplural1, this.pronouns.futurplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemmaCopy.lemmaValues.futurdubitativplural1, this.pronouns.futurdubitativplural1] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurdubitativplural1, [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);

    [this.lemmaCopy.lemmaValues.preschentplural2, this.pronouns.preschentplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.preschentplural2, [ppConj[4], pp[4], pp[8], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.imperfectplural2, this.pronouns.imperfectplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.imperfectplural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.conjunctivplural2, this.pronouns.conjunctivplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctivplural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.conjunctiv2plural2, this.pronouns.conjunctiv2plural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctiv2plural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.cundizionalplural2, this.pronouns.cundizionalplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalplural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.cundizionalindirectplural2, this.pronouns.cundizionalindirectplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalindirectplural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.futurplural2, this.pronouns.futurplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurplural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemmaCopy.lemmaValues.futurdubitativplural2, this.pronouns.futurdubitativplural2] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurdubitativplural2, [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);

    [this.lemmaCopy.lemmaValues.preschentplural3, this.pronouns.preschentplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.preschentplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.imperfectplural3, this.pronouns.imperfectplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.imperfectplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.conjunctivplural3, this.pronouns.conjunctivplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctivplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.conjunctiv2plural3, this.pronouns.conjunctiv2plural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.conjunctiv2plural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.cundizionalplural3, this.pronouns.cundizionalplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.cundizionalindirectplural3, this.pronouns.cundizionalindirectplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.cundizionalindirectplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.futurplural3, this.pronouns.futurplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemmaCopy.lemmaValues.futurdubitativplural3, this.pronouns.futurdubitativplural3] = this.extractPrefixes(this.lemmaCopy.lemmaValues.futurdubitativplural3, [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
  }

  private extractPrefixes(lemma: string|undefined, prefixCandidates: string[]): string[] {
    if (!lemma) {
      return [""];
    }
    const lines = lemma.split(/\r?\n/);
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
