import { Component, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';

import moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { DiffModalComponent } from "../../features/diff-modal/diff-modal.component";
import { EntryDto, EntryVersionInternalDto } from '../../models/dictionary';

@Component({
    selector: 'app-version-history',
    templateUrl: './version-history.component.html',
    styleUrls: ['./version-history.component.scss'],
    standalone: false
})
export class VersionHistoryComponent implements OnChanges {

  loading = false;

  @Input()
  entry?: EntryDto;

  versionHistory: readonly EntryVersionInternalDto[] = [];

  diffOldEntryVersion: EntryVersionInternalDto | undefined;
  diffNewEntryVersion: EntryVersionInternalDto | undefined;

  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService,
    private viewContainerRef: ViewContainerRef,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entry']) {
      this.extractHistory();
    }
  }

  formateDateTime(timestamp: Date): string {
    return moment(timestamp).format("DD-MM-YYYY HH:mm:ss");
  }

  formateTime(timestamp: Date): string {
    return moment(timestamp).format("HH:mm:ss")
  }

  dropOutdatedHistory() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma_history.delete_history_confirmation'),
      nzContent: '<b style="color: red;">' +  this.entry!.current?.deStichwort + ' / ' + this.entry!.current?.rmStichwort + '</b>',
      nzClosable: false,
      nzOkDanger: true,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => this.dropOutdatedHistoryConfirmed(),
      nzOnCancel: () => {}
    });
  }

  beforeChanged(version?: EntryVersionInternalDto) {
    if (!version) {
      version = new EntryVersionInternalDto();
    }
    this.diffOldEntryVersion = version;
  }

  afterChanged(version?: EntryVersionInternalDto) {
    if (!version) {
      version = new EntryVersionInternalDto();
    }
    this.diffNewEntryVersion = version;
  }

  showDiff() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.titles.edit'),
      nzContent: DiffModalComponent,
      nzClosable: true,
      nzMaskClosable: true,
      nzWidth: 1100,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        oldLemmaVersion: this.diffOldEntryVersion,
        newLemmaVersion: this.diffNewEntryVersion!,
      },
    });
  }

  private extractHistory() {
    if (this.entry) {
      this.versionHistory = this.entry.versions;
    } else {
      this.versionHistory = []
    }
  }

  private dropOutdatedHistoryConfirmed() {
    this.editorService.dropOutdatedHistory(this.languageSelectionService.getCurrentLanguage(), this.entry!.entryId).subscribe(() => {
      this.reloadEntry();
    });
  }

  private reloadEntry() {
    this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), this.entry!.entryId).subscribe(entry => {
      this.entry = entry;
      this.extractHistory();
    });
  }
}
