import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
  selector: 'app-help-surmiran',
  templateUrl: './help-surmiran.component.html'
})
export class HelpSurmiranComponent implements OnInit {

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
