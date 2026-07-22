import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { HunspellLanguage, ManualLanguage } from "../manuals-spellchecker.component";


@Component({
    selector: 'app-manual-hunspell',
    templateUrl: './manual-hunspell.component.html',
    styleUrls: ['./manual-hunspell.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class ManualHunspellComponent {
  @Input()
  language?: ManualLanguage;

  @Input()
  hunspellLanguage?: HunspellLanguage;

  @Output()
  downloadHunspell = new EventEmitter<void>();
}
