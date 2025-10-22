import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CorpusService } from '../../../services/corpus.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputGroupComponent, NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';
import { NzListComponent, NzListItemComponent, NzListItemActionsComponent, NzListItemActionComponent } from 'ng-zorro-antd/list';
import { HighlighterPipe } from '../../../pipes/highlighter.pipe';

export class FindCorpusEntryData {
  searchTerm?: string;
}

@Component({
    selector: 'app-find-corpus-entry',
    templateUrl: './find-corpus-entry.component.html',
    styleUrl: './find-corpus-entry.component.scss',
    imports: [ɵNzTransitionPatchDirective, NzSpaceCompactItemDirective, NzInputGroupComponent, NzInputDirective, NzButtonComponent, NzWaveDirective, NzIconDirective, NgIf, NzListComponent, NzListItemComponent, NzListItemActionsComponent, NzListItemActionComponent, HighlighterPipe]
})
export class FindCorpusEntryComponent implements OnInit{

  searchTerm = '';
  examples: string[] = [];
  isLoading = false;

  constructor(
    @Inject(NZ_MODAL_DATA) data: FindCorpusEntryData,
    private corpusService: CorpusService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalRef,
  ) {
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
