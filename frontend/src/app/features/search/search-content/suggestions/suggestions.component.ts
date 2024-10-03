import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchCriteria } from '../../../../models/search-criteria';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss'
})
export class SuggestionsComponent {
  @Input() searchCriteria: SearchCriteria = new SearchCriteria();
  @Input() searchSuggestionsDe: string[] = [];
  @Input() searchSuggestionsRm: string[] = [];
  @Output() linkTo = new EventEmitter<string>();

  linkToLemma(lemma: string) {
    this.linkTo.emit(lemma);
  }
}
