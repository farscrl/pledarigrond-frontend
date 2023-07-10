import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HunspellLanguage, ManualLanguage } from "../manuals-spellchecker.component";

@Component({
  selector: 'app-manual-hunspell',
  templateUrl: './manual-hunspell.component.html',
  styleUrls: ['./manual-hunspell.component.scss']
})
export class ManualHunspellComponent {
  @Input()
  language?: ManualLanguage;

  @Input()
  hunspellLanguage?: HunspellLanguage;

  @Output()
  downloadHunspell = new EventEmitter<void>();
}
