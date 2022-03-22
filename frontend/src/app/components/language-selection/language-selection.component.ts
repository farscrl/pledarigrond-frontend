import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Idiom, SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
  selector: 'app-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.scss']
})
export class LanguageSelectionComponent implements OnInit, OnDestroy {

  idiom: Idiom = 'rumgr';

  private idiomSubscription: Subscription|null = null;

  constructor(private selectedLanguageService: SelectedLanguageService) { }

  ngOnInit(): void {
    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(value => this.idiom = value);
  }

  ngOnDestroy(): void {
      if (this.idiomSubscription) {
        this.idiomSubscription.unsubscribe();
      }
  }
}
