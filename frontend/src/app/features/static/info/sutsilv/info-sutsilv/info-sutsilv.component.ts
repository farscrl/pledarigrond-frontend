import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/info.service';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

import { InfoSutsilvRmComponent } from '../info-sutsilv-rm/info-sutsilv-rm.component';
import { InfoSutsilvDeComponent } from '../info-sutsilv-de/info-sutsilv-de.component';

@Component({
    selector: 'app-info-sutsilv',
    templateUrl: './info-sutsilv.component.html',
    imports: [InfoSutsilvRmComponent, InfoSutsilvDeComponent]
})
export class InfoSutsilvComponent implements OnInit, OnDestroy {

  frontEndLanguage: FrontendLanguage = 'rm';

  nbrEntries?: number;

  private languageSubscription?: Subscription;

  constructor(private selectedLanguageService: SelectedLanguageService, private infoService: InfoService) { }

  ngOnInit(): void {
    this.languageSubscription = this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => {
      this.frontEndLanguage = value;
    });
    this.infoService.getNbrEntries(this.selectedLanguageService.getSelectedLanguageUrlSegment()).subscribe(value => {
      this.nbrEntries = value;
    });
  }

  ngOnDestroy(): void {
      if (this.languageSubscription) {
        this.languageSubscription.unsubscribe();
      }
  }
}
