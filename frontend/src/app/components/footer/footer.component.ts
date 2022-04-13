import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Idiom, SelectedLanguageService } from 'src/app/services/selected-language.service';
import { SimpleModalService } from "ngx-simple-modal";
import { SuggestionComponent } from './suggestion/suggestion.component';
import { ExportComponent } from 'src/app/features/export/export.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  idiom: Idiom = 'rumgr';
  idiomLong: string = 'rumantschgrischun';

  private languageSubscription?: Subscription;

  constructor(private selectedLanguageService: SelectedLanguageService, private simpleModalService: SimpleModalService) { }

  ngOnInit(): void {
    this.languageSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(value => {
      this.idiom = value;
      this.idiomLong = this.selectedLanguageService.getSelectedLanguageUrlSegment();
    });
  }

  ngOnDestroy(): void {
      if (this.languageSubscription) {
        this.languageSubscription.unsubscribe();
      }
  }

  get currentYear() {
    return (new Date()).getFullYear();
  }

  openSuggestionModal() {
    this.simpleModalService.addModal(SuggestionComponent, null)
      .subscribe();
  }

  openDownloadModal() {
    this.simpleModalService.addModal(ExportComponent, null)
      .subscribe();
  }
}
