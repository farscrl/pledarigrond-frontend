import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManualLanguage } from "../manuals-spellchecker.component";

@Component({
  selector: 'app-manual-macos',
  templateUrl: './manual-macos.component.html',
  styleUrls: ['./manual-macos.component.scss']
})
export class ManualMacosComponent {
  @Input()
  language?: ManualLanguage;

  @Output()
  downloadHunspell = new EventEmitter<void>();
}
