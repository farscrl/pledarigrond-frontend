import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { HunspellLanguage, ManualLanguage } from "../manuals-spellchecker.component";


@Component({
    selector: 'app-manual-macos',
    templateUrl: './manual-macos.component.html',
    styleUrls: ['./manual-macos.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class ManualMacosComponent {
  @Input()
  language?: ManualLanguage;

  @Input()
  hunspellLanguage?: HunspellLanguage;

  @Output()
  downloadHunspell = new EventEmitter<void>();
}
