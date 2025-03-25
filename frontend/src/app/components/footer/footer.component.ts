import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {FrontendLanguage, Idiom, SelectedLanguageService} from 'src/app/services/selected-language.service';
import { NgxModalService } from "ngx-modalview";
import { SuggestionComponent } from './suggestion/suggestion.component';
import { ExportComponent } from 'src/app/features/export/export.component';
import { LanguageUtils } from 'src/app/utils/language-utils';

import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [RouterLink, TranslatePipe]
})
export class FooterComponent implements OnInit, OnDestroy {

  idiom: Idiom = 'rumgr';
  idiomLong: string = 'rumantschgrischun';
  frontEndLanguage: FrontendLanguage = 'rm';

  private languageSubscription?: Subscription;
  private frontendLanguageSubscription?: Subscription;

  constructor(private selectedLanguageService: SelectedLanguageService, private modalService: NgxModalService, public languageUtils: LanguageUtils) { }

  ngOnInit(): void {
    this.languageSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(value => {
      this.idiom = value;
      this.idiomLong = this.selectedLanguageService.getSelectedLanguageUrlSegment();
    });
    this.frontendLanguageSubscription = this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => {
      this.frontEndLanguage = value;
    });
  }

  ngOnDestroy(): void {
      if (this.languageSubscription) {
        this.languageSubscription.unsubscribe();
      }
      if (this.frontendLanguageSubscription) {
        this.frontendLanguageSubscription.unsubscribe();
      }
  }

  get currentYear() {
    return (new Date()).getFullYear();
  }

  openSuggestionModal() {
    this.modalService.addModal(SuggestionComponent, null)
      .subscribe();
  }

  openDownloadModal() {
    this.modalService.addModal(ExportComponent, null)
      .subscribe();
  }
}
