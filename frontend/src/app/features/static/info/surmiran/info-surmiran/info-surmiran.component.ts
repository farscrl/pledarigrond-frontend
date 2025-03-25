import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/info.service';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

import { InfoSurmiranRmComponent } from '../info-surmiran-rm/info-surmiran-rm.component';
import { InfoSurmiranDeComponent } from '../info-surmiran-de/info-surmiran-de.component';

@Component({
    selector: 'app-info-surmiran',
    templateUrl: './info-surmiran.component.html',
    imports: [InfoSurmiranRmComponent, InfoSurmiranDeComponent]
})
export class InfoSurmiranComponent implements OnInit {

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
