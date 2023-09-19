import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Idiom, SelectedLanguageService } from 'src/app/services/selected-language.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.scss']
})
export class LanguageSelectionComponent implements OnInit, OnDestroy {

  idiom: Idiom = 'rumgr';
  urlSegment = 'rumantschgrischun';

  private idiomSubscription: Subscription|null = null;

  constructor(private selectedLanguageService: SelectedLanguageService, public router: Router) { }

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
