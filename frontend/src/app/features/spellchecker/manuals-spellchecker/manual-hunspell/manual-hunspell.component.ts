import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManualLanguage } from "../manuals-spellchecker.component";

@Component({
  selector: 'app-manual-hunspell',
  templateUrl: './manual-hunspell.component.html',
  styleUrls: ['./manual-hunspell.component.scss']
})
export class ManualHunspellComponent {
  @Input()
  language?: ManualLanguage;

  @Output()
  downloadHunspell = new EventEmitter<void>();
}
