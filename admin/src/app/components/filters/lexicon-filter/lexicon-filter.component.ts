import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.editorService.getChoiceFieldsSuggestions(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.genderValues = data.gender;
      this.grammarValues = data.grammar;
    })
  }

  toggleDetails() {
    this.showSearchDetails = !this.showSearchDetails;
  }

  search() {
    this.searchCriteriaChange.emit(this.searchCriteria);
  }

  reset() {
    this.searchCriteria = new EditorSearchCriteria();
  }
}
