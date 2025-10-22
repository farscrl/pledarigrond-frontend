import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { EditorSearchCriteria } from 'src/app/models/lucene-search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { FormsModule } from '@angular/forms';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import { NzRadioGroupComponent, NzRadioComponent } from 'ng-zorro-antd/radio';
import { NzAutocompleteTriggerDirective, NzAutocompleteComponent } from 'ng-zorro-antd/auto-complete';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-lexicon-filter',
    templateUrl: './lexicon-filter.component.html',
    styleUrls: ['./lexicon-filter.component.scss'],
    imports: [FormsModule, NzFormDirective, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzInputDirective, NzCheckboxComponent, NzDividerComponent, ɵNzTransitionPatchDirective, NzIconDirective, NzRadioGroupComponent, NzRadioComponent, NzAutocompleteTriggerDirective, NzAutocompleteComponent, NzSelectComponent, NzOptionComponent, NzButtonComponent, NzWaveDirective, TranslatePipe]
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
      subscriptions.push(this.getRmSubsemanticObservable(value));
      subscriptions.push(this.getDeSubsemanticObservable(value));
    } else if (this.searchCriteria.searchDirection === 'ROMANSH') {
      subscriptions.push(this.getRmSubsemanticObservable(value));
    } else if (this.searchCriteria.searchDirection === 'GERMAN') {
      subscriptions.push(this.getDeSubsemanticObservable(value));
    }

    forkJoin(subscriptions).subscribe((data) => {
      if (data.length === 1) {
        this.semanticsAutocomplete = data[0].sort();
      } else {
        this.semanticsAutocomplete = [].concat(data[0], data[1]).sort();
      }
    });
  }

  private getDeSubsemanticObservable(value: string): Observable<any> {
    return this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'deSubsemantik', value);
  }

  private getRmSubsemanticObservable(value: string): Observable<any> {
    return this.editorService.getSearchSuggestions(this.languageSelectionService.getCurrentLanguage(), 'rmSubsemantik', value);
  }
}
