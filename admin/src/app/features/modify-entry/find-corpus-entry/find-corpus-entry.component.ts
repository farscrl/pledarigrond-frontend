import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CorpusService } from '../../../services/corpus.service';
import { LanguageSelectionService } from '../../../services/language-selection.service';

export class FindCorpusEntryData {
  searchTerm?: string;
}

@Component({
  selector: 'app-find-corpus-entry',
  templateUrl: './find-corpus-entry.component.html',
  styleUrl: './find-corpus-entry.component.scss'
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
    this.corpusService.find(this.languageSelectionService.getCurrentLanguage(), searchTerm).subscribe(examples => {
      this.examples = examples;
      this.isLoading = false;
    })
  }

  select(value: string) {
    this.modal.close(value);
  }
}
