import { Component, Input } from '@angular/core';
import { NgxModalComponent } from "ngx-modalview";

@Component({
  selector: 'app-manuals-spellchecker',
  templateUrl: './manuals-spellchecker.component.html',
  styleUrls: ['./manuals-spellchecker.component.scss']
})
export class ManualsSpellcheckerComponent extends NgxModalComponent<{manualType: ManualType, language: ManualLanguage, hunspellLanguage: HunspellLanguage }, null> {

  @Input()
  manualType?: ManualType;

  @Input()
  language?: ManualLanguage;

  @Input()
  hunspellLanguage?: HunspellLanguage;

  constructor() {
    super();
  }

  downloadHunspell() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', `https://www.spellchecker.pledarigrond.ch/hunspell/${this.hunspellLanguage}.zip`);
    link.setAttribute('download', `${this.hunspellLanguage}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export type ManualType = 'macos' | 'hunspell' | 'word';
export type ManualLanguage = 'de' | 'surmiran' | 'sutsilvan' | 'rumantschgrischun';
export type HunspellLanguage = 'rm-surmiran' | 'rm-sutsilv';
