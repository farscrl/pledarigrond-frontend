import { Component, OnInit } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  constructor(private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.editorService.getAgetLexEntriesll(this.languageSelectionService.getCurrentLanguage()).subscribe(page => {
      console.log(page);
    });
  }

}
