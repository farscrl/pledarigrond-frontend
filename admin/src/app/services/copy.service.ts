import { Injectable } from '@angular/core';
import { Adjective, Noun, Verb } from '../models/dictionary';

@Injectable({
  providedIn: 'root'
})
export class CopyService {
  private verb?: Verb;
  private noun?: Noun;
  private adjective?: Adjective;

  constructor() { }

  copyConjugation(verb: Verb) {
    if (!verb) {
      return;
    }
    this.verb = verb;
  }

  canPasteConjugation(): boolean {
    return this.verb !== undefined;
  }

  get conjugation(): Verb {
    return this.verb!;
  }

  get infinitive(): string {
    if (!this.verb) {
      return '';
    }
    return this.verb.infinitiv!;
  }

  copyInflectionNoun(noun: Noun) {
    if (!noun) {
      return;
    }
    this.noun = noun;
  }
  canPasteInflectionNoun(): boolean {
    return this.noun !== undefined;
  }

  get inflectionNoun(): Noun {
    return this.noun!;
  }

  get inflectionNounBaseForm(): string {
    if (!this.noun) {
      return '';
    }

    return this.noun.baseForm!;
  }


  copyInflectionAdjective(adjective: Adjective) {
    if (!adjective) {
      return;
    }
    this.adjective = adjective;
  }

  canPasteInflectionAdjective(): boolean {
    return this.adjective !== undefined;
  }

  get inflectionAdjective(): Adjective {
    return this.adjective!;
  }

  get inflectionAdjectiveBaseForm(): string {
    if (!this.adjective) {
      return '';
    }

    return this.adjective.baseForm!;
  }
}
