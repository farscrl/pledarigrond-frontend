import { Component, OnInit } from '@angular/core';
import { IndexInfos } from 'src/app/models/db-infos';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-index-administration',
  templateUrl: './index-administration.component.html',
  styleUrls: ['./index-administration.component.scss']
})
export class IndexAdministrationComponent implements OnInit {

  indexInfos: IndexInfos = new IndexInfos();
  isLoading: boolean = false;
  isRebuilding: boolean = false;
  isRebuildingSuggestions: boolean = false;

  constructor(private dbService: DbService, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.loadIndexInfos();
  }

  loadIndexInfos() {
    this.isLoading = true;
    this.dbService.getIndexInfos(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.indexInfos = data;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.error(error);
    });
  }

  rebuildIndex() {
    this.isRebuilding = true;
    this.dbService.rebuildIndex(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.isRebuilding = false;
      this.loadIndexInfos();
    }, error => {
      this.isRebuilding = false;
      console.error(error);
    });
  }

  rebuildSuggestionsIndex() {
    this.isRebuildingSuggestions = true;
    this.dbService.rebuildSuggestionsIndex(this.languageSelectionService.getCurrentLanguage()).subscribe(data => {
      this.isRebuildingSuggestions = false;
    }, error => {
      this.isRebuildingSuggestions = false;
      console.error(error);
    });
  }
}
