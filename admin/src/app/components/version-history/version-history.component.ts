import { Component, Input, OnChanges, SimpleChanges, ViewContainerRef, inject } from '@angular/core';

import moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { DiffModalComponent } from "../../features/diff-modal/diff-modal.component";
import { EntryDto, EntryVersionInternalDto } from '../../models/dictionary';
import { NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzTbodyComponent } from 'ng-zorro-antd/table';

import { ActionComponent } from '../data/action/action.component';
import { UserRoleComponent } from '../data/user-role/user-role.component';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-version-history',
    templateUrl: './version-history.component.html',
    styleUrls: ['./version-history.component.scss'],
    imports: [NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzTbodyComponent, ActionComponent, UserRoleComponent, NzEmptyComponent, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, NzIconDirective, TranslatePipe]
})
export class VersionHistoryComponent implements OnChanges {
  private modalService = inject(NzModalService);
  private translateService = inject(TranslateService);
  private viewContainerRef = inject(ViewContainerRef);
  private editorService = inject(EditorService);
  private languageSelectionService = inject(LanguageSelectionService);


  loading = false;

  @Input()
  entry?: EntryDto;

  versionHistory: readonly EntryVersionInternalDto[] = [];

  diffOldEntryVersion: EntryVersionInternalDto | undefined;
  diffNewEntryVersion: EntryVersionInternalDto | undefined;

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
    let lemma = this.entry!.current?.deStichwort + ' ⇔ ' + this.entry!.current?.rmStichwort;
    if (!this.entry!.current) {
      lemma = this.entry!.suggestions.length > 0 ? this.entry!.suggestions[0].deStichwort + ' ⇔ ' + this.entry!.suggestions[0].rmStichwort : '';
    }
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('lexicon.lemma_history.delete_history_confirmation'),
      nzContent: lemma,
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
        original: this.diffOldEntryVersion,
        change: this.diffNewEntryVersion!,
      },
    });
  }

  private extractHistory() {
    if (this.entry) {
      this.versionHistory = this.entry.versions.slice().reverse();
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

  protected readonly EntryVersionInternalDto = EntryVersionInternalDto;
}
