import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntry, LexEntryUi } from 'src/app/models/lex-entry';

import moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { DiffModalComponent } from "../../features/diff-modal/diff-modal.component";

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss']
})
export class VersionHistoryComponent implements OnInit {

  loading = false;

  @Input()
  set lexEntry(lexEntry: LexEntryUi | undefined) {
    this.selectedLexEntry = lexEntry;
    this.extractHistory();
  }

  selectedLexEntry?: LexEntryUi;

  versionHistory: readonly LemmaVersion[] = [];

  diffOldLemmaVersion: LemmaVersion | undefined;
  diffNewLemmaVersion: LemmaVersion | undefined;

  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService,
    private viewContainerRef: ViewContainerRef,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
  ) { }

  ngOnInit(): void {

  }

  formateDate(timestamp: number): string {
    return moment(timestamp).format("DD-MM-YYYY");
  }

  formateTime(timestamp: number): string {
    return moment(timestamp).format("HH:mm:ss")
  }

  dropOutdatedHistory() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma_history.delete_history_confirmation'),
      nzContent: '<b style="color: red;">' +  this.selectedLexEntry!.current.lemmaValues.DStichwort + ' / ' + this.selectedLexEntry!.current.lemmaValues.RStichwort + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.dropOutdatedHistoryConfirmed(),
      nzOnCancel: () => {}
    });
  }

  beforeChanged(lemmaVersion?: LemmaVersion) {
    if (!lemmaVersion) {
      lemmaVersion = new LemmaVersion();
    }
    this.diffOldLemmaVersion = lemmaVersion;
  }

  afterChanged(lemmaVersion?: LemmaVersion) {
    if (!lemmaVersion) {
      lemmaVersion = new LemmaVersion();
    }
    this.diffNewLemmaVersion = lemmaVersion;
  }

  showDiff() {
    // diff view is implemented to take lex entry. Thus, we create a new lexEntry with the lemmaVersions to compare.
    const lexEntry = new LexEntry();
    lexEntry.current =  JSON.parse(JSON.stringify(this.diffOldLemmaVersion!));
    lexEntry.current.internalId = 0;
    lexEntry.mostRecent =JSON.parse(JSON.stringify(this.diffNewLemmaVersion!));
    lexEntry.mostRecent.internalId = 1;

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.titles.edit'),
      nzContent: DiffModalComponent,
      nzClosable: true,
      nzMaskClosable: true,
      nzWidth: 1100,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        lexEntry: lexEntry,
      },
    });
  }

  private extractHistory() {
    if (this.selectedLexEntry) {
      this.versionHistory = this.selectedLexEntry.versionHistory;
    } else {
      this.versionHistory = []
    }
  }

  private dropOutdatedHistoryConfirmed() {
    this.editorService.dropOutdatedHistory(this.languageSelectionService.getCurrentLanguage(), this.selectedLexEntry!.id!).subscribe(() => {
      this.reloadEntry();
    });
  }

  private reloadEntry() {
    this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), this.selectedLexEntry!.id!).subscribe(entry => {
      this.selectedLexEntry = entry as LexEntryUi;
      this.extractHistory();
    });
  }
}
