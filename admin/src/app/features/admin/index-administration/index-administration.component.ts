import { Component, OnInit, inject } from '@angular/core';
import { IndexInfos } from 'src/app/models/db-infos';
import { DbService } from 'src/app/services/db.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzPageHeaderComponent, NzPageHeaderTitleDirective, NzPageHeaderSubtitleDirective, NzPageHeaderExtraDirective } from 'ng-zorro-antd/page-header';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-index-administration',
    templateUrl: './index-administration.component.html',
    styleUrls: ['./index-administration.component.scss'],
    imports: [NzPageHeaderComponent, NzPageHeaderTitleDirective, NzPageHeaderSubtitleDirective, NzPageHeaderExtraDirective, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, NzCardComponent, NzRowDirective, NzColDirective, NzStatisticComponent, DecimalPipe, TranslatePipe]
})
export class IndexAdministrationComponent implements OnInit {
  private dbService = inject(DbService);
  private languageSelectionService = inject(LanguageSelectionService);


  indexInfos: IndexInfos = new IndexInfos();
  isLoading: boolean = false;
  isRebuilding: boolean = false;
  isRebuildingSuggestions: boolean = false;

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
