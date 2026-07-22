import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ManualLanguage } from "../manuals-spellchecker.component";


@Component({
    selector: 'app-manual-word',
    templateUrl: './manual-word.component.html',
    styleUrls: ['./manual-word.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class ManualWordComponent {
  @Input()
  language?: ManualLanguage;

  @Output()
  downloadHunspell = new EventEmitter<void>();
}
