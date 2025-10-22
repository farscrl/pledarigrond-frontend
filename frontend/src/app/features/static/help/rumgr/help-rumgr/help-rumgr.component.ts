import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

import { HelpRumgrRmComponent } from '../help-rumgr-rm/help-rumgr-rm.component';
import { HelpRumgrDeComponent } from '../help-rumgr-de/help-rumgr-de.component';

@Component({
    selector: 'app-help-rumgr',
    templateUrl: './help-rumgr.component.html',
    imports: [HelpRumgrRmComponent, HelpRumgrDeComponent]
})
export class HelpRumgrComponent implements OnInit {
  private selectedLanguageService = inject(SelectedLanguageService);


  frontEndLanguage: FrontendLanguage = 'rm';

  private languageSubscription?: Subscription;

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
