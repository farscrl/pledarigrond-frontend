import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { EditorSearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-lexicon-filter',
  templateUrl: './lexicon-filter.component.html',
  styleUrls: ['./lexicon-filter.component.scss']
})
export class LexiconFilterComponent implements OnInit {

  @Input()
  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  @Output()
  searchCriteriaChange = new EventEmitter<EditorSearchCriteria>();

  showSearchDetails = false;

  genderValues: string[] = [];
  grammarValues: string[] = [];

  categoryAutocomplete: string[] = [];
  semanticsAutocomplete: string[] = [];

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.editorService.getChoiceFieldsSuggestions(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.genderValues = data.gender;
      this.grammarValues = data.grammar;
    });
  }

  toggleDetails() {
    this.showSearchDetails = !this.showSearchDetails;
  }

  search() {
    this.searchCriteriaChange.emit(this.searchCriteria);
  }

  reset() {
    this.searchCriteria = new EditorSearchCriteria();
    this.searchCriteriaChange.emit(this.searchCriteria);
  }

  categoryChanged() {
    const value = this.searchCriteria.category;
    if (value === "") {
      this.categoryAutocomplete = [];
      return;
    }

    this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'categories', value).subscribe(data => {
      this.categoryAutocomplete = data;
    });
  }

  semanticsChanged() {
    const value = this.searchCriteria.subSemantics;
    if (value === "") {
      this.semanticsAutocomplete = [];
      return;
    }

    const subscriptions: Observable<any>[] = [];
    if (this.searchCriteria.searchDirection === 'BOTH') {
      subscriptions.push(this.getRSubsemanticObservable(value));
      subscriptions.push(this.getDSubsemanticObservable(value));
    } else if (this.searchCriteria.searchDirection === 'ROMANSH') {
      subscriptions.push(this.getRSubsemanticObservable(value));
    } else if (this.searchCriteria.searchDirection === 'GERMAN') {
      subscriptions.push(this.getDSubsemanticObservable(value));
    }

    forkJoin(subscriptions).subscribe((data) => {
      if (data.length === 1) {
        this.semanticsAutocomplete = data[0].sort();
      } else {
        this.semanticsAutocomplete = [].concat(data[0], data[1]).sort();
      }
    });
  }

  private getDSubsemanticObservable(value: string): Observable<any> {
    return this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'DSubsemantik', value);
  }

  private getRSubsemanticObservable(value: string): Observable<any> {
    return this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'RSubsemantik', value);
  }
}
