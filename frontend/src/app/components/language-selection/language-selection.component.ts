import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Idiom, SelectedLanguageService } from 'src/app/services/selected-language.service';
import { Router, RouterLink } from "@angular/router";

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-language-selection',
    templateUrl: './language-selection.component.html',
    styleUrls: ['./language-selection.component.scss'],
    imports: [RouterLink, TranslatePipe]
})
export class LanguageSelectionComponent implements OnInit, OnDestroy {
  private selectedLanguageService = inject(SelectedLanguageService);
  router = inject(Router);


  idiom: Idiom = 'rumgr';
  urlSegment = 'rumantschgrischun';

  private idiomSubscription: Subscription|null = null;

  ngOnInit(): void {
    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(idiom => {
      this.idiom = idiom;
      this.urlSegment = this.selectedLanguageService.getSelectedLanguageUrlSegment();
    });
  }

  ngOnDestroy(): void {
      if (this.idiomSubscription) {
        this.idiomSubscription.unsubscribe();
      }
  }
}
