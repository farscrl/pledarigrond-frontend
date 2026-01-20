import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SearchCriteria } from '../../../../models/search-criteria';
import { SelectedLanguageService } from '../../../../services/selected-language.service';

@Component({
    selector: 'app-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrl: './suggestions.component.scss',
  imports: []
})
export class SuggestionsComponent {
  @Input() searchCriteria: SearchCriteria = new SearchCriteria();
  @Input() searchSuggestionsDe: string[] = [];
  @Input() searchSuggestionsRm: string[] = [];
  @Output() linkTo = new EventEmitter<string>();

  private selectedLanguageService = inject(SelectedLanguageService);

  linkToLemma(lemma: string) {
    this.linkTo.emit(lemma);
  }

  get didUMeanString(): string {
    const idiom = this.selectedLanguageService.getCurrentIdiom();
    switch (idiom) {
      case "sursilv":
        return "Has ti manegiau";

      case "puter":
      case "rumgr":
      case "sutsilv":
      case "surmiran":
      case "vallader":
      default:
        return "Has ti manegià"
    }
  }

  get orString(): string {
    const idiom = this.selectedLanguageService.getCurrentIdiom();
    switch (idiom) {
      case "sursilv":
        return "ni";

      case "puter":
      case "rumgr":
      case "sutsilv":
      case "surmiran":
      case "vallader":
      default:
        return "u"
    }
  }
}
