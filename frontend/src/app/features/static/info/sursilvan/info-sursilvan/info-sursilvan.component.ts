import { Component } from '@angular/core';
import { FrontendLanguage, SelectedLanguageService } from '../../../../../services/selected-language.service';
import { Subscription } from 'rxjs';
import { InfoService } from '../../../../../services/info.service';
import { InfoSursilvanDeComponent } from '../info-sursilvan-de/info-sursilvan-de.component';
import { InfoSursilvanRmComponent } from '../info-sursilvan-rm/info-sursilvan-rm.component';

@Component({
  selector: 'app-info-sursilvan',
  templateUrl: './info-sursilvan.component.html',
  imports: [
    InfoSursilvanDeComponent,
    InfoSursilvanRmComponent
  ],
  styleUrl: './info-sursilvan.component.scss'
})
export class InfoSursilvanComponent {
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
