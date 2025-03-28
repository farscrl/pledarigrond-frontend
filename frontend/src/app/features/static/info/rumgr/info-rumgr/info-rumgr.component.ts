import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/info.service';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

import { InfoRumgrRmComponent } from '../info-rumgr-rm/info-rumgr-rm.component';
import { InfoRumgrDeComponent } from '../info-rumgr-de/info-rumgr-de.component';

@Component({
    selector: 'app-info-rumgr',
    templateUrl: './info-rumgr.component.html',
    imports: [InfoRumgrRmComponent, InfoRumgrDeComponent]
})
export class InfoRumgrComponent implements OnInit {

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
