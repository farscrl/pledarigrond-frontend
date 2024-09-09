import { Component, OnDestroy, OnInit } from '@angular/core';
import { FrontendLanguage, SelectedLanguageService } from '../../../../../services/selected-language.service';
import { Subscription } from 'rxjs';
import { HelpSursilvanRmComponent } from '../help-sursilvan-rm/help-sursilvan-rm.component';
import { HelpSursilvanDeComponent } from '../help-sursilvan-de/help-sursilvan-de.component';

@Component({
  selector: 'app-help-sursilvan',
  templateUrl: './help-sursilvan.component.html',
  imports: [
    HelpSursilvanRmComponent,
    HelpSursilvanDeComponent
  ],
  styleUrl: './help-sursilvan.component.scss'
})
export class HelpSursilvanComponent implements OnInit, OnDestroy {
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
