import { Component, Input, OnInit } from '@angular/core';
import { LexEntry } from "../../models/lex-entry";
import { Language } from "../../models/security";
import { LemmaVersion } from "../../models/lemma-version";
import { ReferenceVerbDto } from '../../models/reference-verb-dto';

@Component({
  selector: 'app-lemma-diff',
  templateUrl: './lemma-diff.component.html',
  styleUrls: ['./lemma-diff.component.scss']
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
}
