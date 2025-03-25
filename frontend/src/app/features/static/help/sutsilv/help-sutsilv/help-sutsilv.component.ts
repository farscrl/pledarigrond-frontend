import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

import { HelpSutsilvRmComponent } from '../help-sutsilv-rm/help-sutsilv-rm.component';
import { HelpSutsilvDeComponent } from '../help-sutsilv-de/help-sutsilv-de.component';

@Component({
    selector: 'app-help-sutsilv',
    templateUrl: './help-sutsilv.component.html',
    imports: [HelpSutsilvRmComponent, HelpSutsilvDeComponent]
})
export class HelpSutsilvComponent implements OnInit {

  frontEndLanguage: FrontendLanguage = 'rm';

  private languageSubscription?: Subscription;

  constructor(private selectedLanguageService: SelectedLanguageService) { }

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

}
