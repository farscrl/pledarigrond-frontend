import { Component, Input, OnInit } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";

@Component({
  selector: 'app-manuals-spellchecker',
  templateUrl: './manuals-spellchecker.component.html',
  styleUrls: ['./manuals-spellchecker.component.scss']
})
export class ManualsSpellcheckerComponent extends SimpleModalComponent<{manualType: ManualType }, null> implements OnInit {

  @Input()
  manualType?: ManualType;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  downloadHunspell() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '/assets/hunspell/rm-surmiran.zip');
    link.setAttribute('download', `rm-surmiran.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export type ManualType = 'macos' | 'hunspell';
