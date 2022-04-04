import { Component, OnInit } from '@angular/core';
import { LexEntry } from 'src/app/models/lex-entry';
import { Page } from 'src/app/models/page';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';


@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {

  results: Page<LexEntry>  = new Page<LexEntry>();

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.editorService.getAllLexEntries(this.languageSelectionService.getCurrentLanguage()).subscribe(page => {
      console.log(page);
      this.results = page;
    });
  }

}
