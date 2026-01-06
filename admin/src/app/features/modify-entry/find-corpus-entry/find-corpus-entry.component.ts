import { Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CorpusService } from '../../../services/corpus.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import {
  NzListComponent,
  NzListItemActionComponent,
  NzListItemActionsComponent,
  NzListItemComponent
} from 'ng-zorro-antd/list';
import { HighlighterPipe } from '../../../pipes/highlighter.pipe';

export class FindCorpusEntryData {
  searchTerm?: string;
}

@Component({
    selector: 'app-find-corpus-entry',
    templateUrl: './find-corpus-entry.component.html',
    styleUrl: './find-corpus-entry.component.scss',
    imports: [NzInputGroupComponent, NzInputDirective, NzButtonComponent, NzWaveDirective, NzIconDirective, NzListComponent, NzListItemComponent, NzListItemActionsComponent, NzListItemActionComponent, HighlighterPipe]
})
export class FindCorpusEntryComponent implements OnInit{
  private corpusService = inject(CorpusService);
  private languageSelectionService = inject(LanguageSelectionService);
  private modal = inject(NzModalRef);


  searchTerm = '';
  examples: string[] = [];
  isLoading = false;

  constructor() {
    const data = inject<FindCorpusEntryData>(NZ_MODAL_DATA);

    this.searchTerm = data.searchTerm!;
  }

  ngOnInit() {
    this.search(this.searchTerm);
  }

  search(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.isLoading = true;
    this.examples = [];
    this.corpusService.find(this.languageSelectionService.getCurrentLanguage(), searchTerm).subscribe(examples => {
      this.examples = examples;
      this.isLoading = false;
    })
  }

  select(value: string) {
    this.modal.close(value);
  }
}
