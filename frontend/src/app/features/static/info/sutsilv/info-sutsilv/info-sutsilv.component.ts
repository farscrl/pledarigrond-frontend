import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/info.service';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
    selector: 'app-info-sutsilv',
    templateUrl: './info-sutsilv.component.html',
    standalone: false
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
