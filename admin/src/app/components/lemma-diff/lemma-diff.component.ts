import { Component, Input, OnInit } from '@angular/core';
import { LexEntry } from "../../models/lex-entry";
import { Language } from "../../models/security";
import { LemmaVersion } from "../../models/lemma-version";
import { ReferenceVerbDto } from '../../models/reference-verb-dto';

@Component({
    selector: 'app-lemma-diff',
    templateUrl: './lemma-diff.component.html',
    styleUrls: ['./lemma-diff.component.scss'],
    standalone: false
})
export class LemmaDiffComponent implements OnInit{
  @Input()
  language: Language = Language.RUMANTSCHGRISCHUN;

  @Input()
  lexEntry: LexEntry = new LexEntry();

  @Input()
  showComments = false;

  @Input()
  referenceVerb?: ReferenceVerbDto;

  oldLemmaVersion: LemmaVersion = new LemmaVersion();
  newLemmaVersion: LemmaVersion = new LemmaVersion();

  ngOnInit() {
    this.calculateValues();
  }

  ngOnChanges() {
    this.calculateValues();
  }

  private calculateValues() {
    this.newLemmaVersion = this.lexEntry.mostRecent;
    if (this.lexEntry.mostRecent.internalId == this.lexEntry.current.internalId) {
      this.oldLemmaVersion = new LemmaVersion();
    } else {
      this.oldLemmaVersion = this.lexEntry.current;
    }
  }

  removeSurilvanPronouns(value?: string): string|undefined {
    if (value === undefined) {
      return undefined;
    }

    const prefixes = ['che ', 'ch\'', 'jeu ', 'ti ', 'el/ella ', 'i ', 'nus ', 'vus ', 'els/ellas ']
    const singleForms: string[] = value.split(/\r?\n|\r|\u0085|\u2028|\u2029/);
    for (let i = 0; i < singleForms.length; i++) {
      if (singleForms[i].trim() === '') {
        continue;
      }
      let enclosedInBrackets = false;
      if (singleForms[i].charAt(0) === '(' && singleForms[i].charAt(singleForms[i].length - 1) === ')') {
        enclosedInBrackets = true;
        singleForms[i] = singleForms[i].replace("(", "").replace(")", "");
      }
      for (const p of prefixes) {
        if (singleForms[i].startsWith(p)) {
          singleForms[i] = singleForms[i].substring(p.length).trim();
        }
      }
      singleForms[i] = singleForms[i].replace(/!$/, '').trim();
      if (enclosedInBrackets) {
        singleForms[i] = "(" + singleForms[i] + ")";
      }
    }
    return singleForms.join("\n");
  }
}
