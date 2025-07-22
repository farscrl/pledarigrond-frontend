import { Component, HostListener, OnInit, ViewContainerRef } from '@angular/core';
import { EditorSearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { MainEntryComponent } from '../../modify-entry/main-entry/main-entry.component';
import { Page } from 'src/app/models/page';
import { InflectionType } from 'src/app/models/inflection';
import { InflectionService } from 'src/app/services/inflection.service';
import { Language } from "../../../models/security";
import { ReferenceVerbDto } from '../../../models/reference-verb-dto';
import { EntryDto, EntryVersionExtendedDto, EntryVersionInternalDto, Inflection } from '../../../models/dictionary';
import { AutoReviewListItem } from '../../../models/dictionary-list';

export enum KEY_CODE {
  KEY1 = 49,
  KEY2 = 50,
  KEY3 = 51,
  ENTER = 13,
  DELETE = 46,
  ESCAPE = 27,
  SPACE = 32,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
    selector: 'app-review-auto-changes',
    templateUrl: './review-auto-changes.component.html',
    styleUrls: ['./review-auto-changes.component.scss'],
    standalone: false
})
export class ReviewAutoChangesComponent implements OnInit {

  isLoadingData = true;
  isWindowOpen = false;

  currentPage: Page<EntryVersionExtendedDto> = new Page();
  reviewItems: AutoReviewListItem[] = [];
  selectedEntryVersion?: AutoReviewListItem;
  selectedEntry?: EntryDto;

  referenceInflection?: ReferenceVerbDto;

  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  language: Language | undefined;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.isWindowOpen || !this.selectedEntryVersion) {
      return;
    }
    if(event.keyCode == KEY_CODE.ENTER){
      this.acceptSelectedLemma();
    } else if (event.keyCode === KEY_CODE.DELETE) {
      this.rejectSelectedLemma();
    } else if (event.keyCode === KEY_CODE.SPACE) {
      this.editSelectedLemma();
    } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.downOne();
    } else if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.upOne();
    }
    if (this.selectedEntry && this.selectedEntryVersion.version.inflection?.inflectionType === 'NOUN') {
      if(event.keyCode == KEY_CODE.KEY1){
        this.nounChangeOnlyMale();
      }
    }

    if (this.selectedEntry && this.selectedEntryVersion.version.inflection?.inflectionType === 'ADJECTIVE') {
      if(event.keyCode == KEY_CODE.KEY1){
        this.adjectiveNoAdverbialForm();
      }
    }
  }

    // used to pass math functions to template
    math = Math;

  constructor(
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private viewContainerRef: ViewContainerRef,
    private inflectionService: InflectionService,
  ) { }

  ngOnInit(): void {
    this.language = this.languageSelectionService.getCurrentLanguage();

    this.searchCriteria.onlyAutomaticChanged = true;
    this.searchCriteria.searchDirection = 'ROMANSH';
    this.searchCriteria.verification = 'UNVERIFIED';
    this.searchCriteria.showReviewLater = false;

    this.changePage(0);
  }

  selectLemma(item: AutoReviewListItem) {
    if (item.selected) {
      item.selected = false;
      this.selectedEntry = undefined;
      this.selectedEntryVersion = undefined;
      return;
    }

    this.deselectAll();
    item.selected = true;
    this.selectedEntryVersion = item;
    this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), item.entryId).subscribe(entry => {
      this.selectedEntry = entry;

      // newly created entries have current == most recent and current != approved -> to have a correct diff, we set current to an empty lemmaValue
      // TODO: there was another condition here. needed? //  && !(this.selectedEntry.current.versionStatus === "Accepted")
      if (this.selectedEntry.current?.versionId === this.selectedEntry.mostRecent.versionId) {
        this.selectedEntry.current = new EntryVersionInternalDto();
      }

      if (this.languageSelectionService.getCurrentLanguage() === Language.SURSILVAN) {
        this.editorService.getReferenceInflection(Language.SURSILVAN, this.selectedEntry.mostRecent.rmStichwort!).subscribe(reference => {
          this.referenceInflection = reference;
        });
      }
    });
  }

  acceptSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }
    const lemma = this.selectedEntryVersion;
    this.editorService.acceptVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion.entryId, this.selectedEntryVersion.version).subscribe((entry) => {
      this.selectedEntryVersion!.local_review_status = 'ACCEPTED';
      this.downOne();
    }, (error) => {
      console.error(error);
    });
  }

  rejectSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }
    this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion.entryId, this.selectedEntryVersion.version).subscribe((entry) => {
      this.selectedEntryVersion!.local_review_status = 'REJECTED';
      this.downOne();
    }, (error) => {
      console.error(error);
    });
  }

  reviewLater() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }
    this.editorService.reviewEntryLater(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion.entryId).subscribe((entry) => {
      this.selectedEntryVersion!.local_review_status = 'LATER';
      this.downOne();
    }, (error) => {
      console.error(error);
    });
  }

  editSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }

    this.isWindowOpen = true;
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.titles.edit'),
      nzContent: MainEntryComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        entryIdToChange: this.selectedEntryVersion.entryId,
        entryVersionToChange: this.selectedEntryVersion,
        directlyLoadDetailView: true,
        replaceSuggestion: true,
      },
      nzOnOk: () => {
        this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion!.entryId).subscribe(entry => {
          this.replaceLemma(entry);
          this.selectedEntryVersion!.local_review_status = 'ACCEPTED';
          this.downOne();
        });
      },
    });

    modal.afterClose.subscribe((evt) => {
      this.isWindowOpen = false;
    });
  }

  nounChangeOnlyMale() {
    this.generateNewInflection('NOUN', "1", this.selectedEntryVersion!.version.rmStichwort!);
  }

  adjectiveNoAdverbialForm() {
    const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedEntry?.mostRecent));

    // TODO implement me correctly
    // delete adverbial form
    delete workingLemmaVersion.lemmaValues.adverbialForm;

    // reset automatically created values
    delete workingLemmaVersion.pgValues.timestamp;
    delete workingLemmaVersion.timestamp;
    delete workingLemmaVersion.userId;
    delete workingLemmaVersion.pgValues.creator;

    this.editorService.modifyEntryVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedEntry!.entryId, workingLemmaVersion).subscribe((entry) => {
      this.replaceLemma(entry);
    });
  }

  createNotification(type: string, title: string, notification: string): void {
    this.notification.create(
      type,
      title,
      notification
    );
  }

  changePage(pageNumber: number)  {
    if (pageNumber > 0) {
      pageNumber--;
    }
    this.editorService.searchLemmaVersions(this.languageSelectionService.getCurrentLanguage(), this.searchCriteria!, pageNumber, 50).subscribe(page => {
      this.isLoadingData = false;
      this.currentPage = page;
      this.reviewItems = page.content.map(value => ({
        entryId: value.entryId,
        version: value,
        selected: false,
        local_review_status: 'UNDEFINED',
      }));
      this.reviewItems = this.filterLexEntryIds(this.reviewItems);
      this.jumpToNext();
    });
  }

  private deselectAll() {
    this.reviewItems.forEach(lemma => {
      lemma.selected = false;
    });
  }

  private jumpToNext() {
    for(let i = 0; i < this.reviewItems.length; i++) {
      const lemma = this.reviewItems[i];
      if (!lemma.local_review_status || lemma.local_review_status === 'UNDEFINED') {
        this.selectLemma(lemma);
        return;
      }
    }
  }

  private upOne() {
    if (!this.selectedEntryVersion) {
      return;
    }

    const sl = this.selectedEntryVersion;
    const idx = this.reviewItems.findIndex(el => el.entryId === sl.entryId);

    if (idx - 1 > -1) {
      this.selectLemma(this.reviewItems[idx-1]);
    }
  }

  private downOne() {
    if (!this.selectedEntryVersion) {
      return;
    }

    const sl = this.selectedEntryVersion;
    const idx = this.reviewItems.findIndex(el => el.entryId === sl.entryId);

    if (idx + 1 < this.reviewItems.length) {
      this.selectLemma(this.reviewItems[idx+1]);
    }
  }

  private generateNewInflection(type: InflectionType, subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), type, subTypeId, baseForm).subscribe(values => {
      const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedEntry?.mostRecent)) as EntryVersionInternalDto;
      workingLemmaVersion.inflection = new Inflection();
      workingLemmaVersion.inflection.inflectionSubtype = subTypeId;

      // TODO: save inflection

      this.editorService.modifyEntryVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedEntry!.entryId, workingLemmaVersion).subscribe((entry) => {
        this.replaceLemma(entry);
      })
    });
  }

  private replaceLemma(entry: EntryDto) {
    this.selectedEntry = entry;
    this.selectedEntryVersion = {
      entryId: entry.entryId,
      version: entry.mostRecent,
      selected: true,
      local_review_status: 'UNDEFINED',
    };

    for (let i = 0; i < this.reviewItems.length; i++) {
      if (this.reviewItems[i].entryId === entry.entryId) {
        this.reviewItems[i] = this.selectedEntryVersion;
      }
    }
  }

  private filterLexEntryIds(entries: AutoReviewListItem[]): AutoReviewListItem[] {
    const returnValue: AutoReviewListItem[] = [];

    entries.forEach(e => {
      if (!returnValue.some(lv => lv.entryId === e.entryId)) {
        returnValue.push(e);
      }
    });

    return returnValue;
  }
}
