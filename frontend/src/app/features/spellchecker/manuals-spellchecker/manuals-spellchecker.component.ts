import { Component, Input, OnInit } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
import {FrontendLanguage, SelectedLanguageService} from "../../../services/selected-language.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-manuals-spellchecker',
  templateUrl: './manuals-spellchecker.component.html',
  styleUrls: ['./manuals-spellchecker.component.scss']
})
export class ManualsSpellcheckerComponent extends SimpleModalComponent<{manualType: ManualType }, null> implements OnInit {

  @Input()
  manualType?: ManualType;

  frontEndLanguage: FrontendLanguage = 'rm';

  private languageSubscription?: Subscription;

  constructor(private selectedLanguageService: SelectedLanguageService) {
    super();
  }

  ngOnInit(): void {
    this.languageSubscription = this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => {
      this.frontEndLanguage = value;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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
