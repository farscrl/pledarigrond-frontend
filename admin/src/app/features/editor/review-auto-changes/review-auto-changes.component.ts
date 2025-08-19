import { Component, HostListener, OnInit, ViewContainerRef } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { MainEntryComponent } from '../../modify-entry/main-entry/main-entry.component';
import { Page } from 'src/app/models/page';
import { InflectionService } from 'src/app/services/inflection.service';
import { Language } from "../../../models/security";
import { ReferenceVerbDto } from '../../../models/reference-verb-dto';
import { EntryDto, EntryVersionInternalDto, Inflection, NormalizedEntryVersionDto } from '../../../models/dictionary';
import { AutoReviewListItem } from '../../../models/dictionary-list';
import { DbSearchCriteria } from '../../../models/db-search-criteria';
import { NotificationService } from '../../../services/notification.service';

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

  currentPage: Page<NormalizedEntryVersionDto> = new Page();
  reviewItems: AutoReviewListItem[] = [];
  selectedEntryVersion?: AutoReviewListItem;
  selectedEntry?: EntryDto;

  referenceInflection?: ReferenceVerbDto;

  searchCriteria: DbSearchCriteria = new DbSearchCriteria();

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
    if (this.selectedEntry && this.selectedEntryVersion.version.version.inflection?.inflectionType === 'NOUN') {
      if(event.keyCode == KEY_CODE.KEY1){
        this.nounChangeOnlyMale();
      }
    }

    if (this.selectedEntry && this.selectedEntryVersion.version.version.inflection?.inflectionType === 'ADJECTIVE') {
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
    private modalService: NzModalService,
    private translateService: TranslateService,
    private viewContainerRef: ViewContainerRef,
    private inflectionService: InflectionService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.language = this.languageSelectionService.getCurrentLanguage();

    this.searchCriteria.state = 'HAS_SUGGESTION';
    this.searchCriteria.onlyAutomaticChanged = true;
    this.searchCriteria.excludeAutomaticChanges = false;
    this.searchCriteria.searchDirection = 'ROMANSH';
    this.searchCriteria.showReviewLater = false;

    this.changePage(0);
  }

  selectLemma(item: AutoReviewListItem) {
    // if the item is already selected, we deselect it
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

      // newly created entries have current == most recent -> to have a correct diff, we set current to an empty lemmaValue
      if (this.selectedEntry.current?.versionId === this.selectedEntry.mostRecent?.versionId) {
        this.selectedEntry.current = new EntryVersionInternalDto();
      }

      if (this.languageSelectionService.getCurrentLanguage() === Language.SURSILVAN) {
        this.editorService.getReferenceInflection(Language.SURSILVAN, this.selectedEntry.current?.rmStichwort!).subscribe(reference => {
          this.referenceInflection = reference;
        });
      }
    });
  }

  acceptSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }

    const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedEntry?.current)) as EntryVersionInternalDto;

    workingLemmaVersion.inflection = this.selectedEntryVersion.version.version.inflection;
    workingLemmaVersion.automaticChange = true;

    const lemma = this.selectedEntryVersion;
    this.editorService.replaceSuggestionAndAccept(
      this.languageSelectionService.getCurrentLanguage(),
      this.selectedEntryVersion.entryId,
      this.selectedEntryVersion.version.version.versionId,
      workingLemmaVersion
    ).subscribe((entry) => {
      this.selectedEntryVersion!.local_review_status = 'ACCEPTED';
      this.downOne();
      this.notificationService.success(
        'Acceptà la proposta',
        'La proposta è vegnida acceptada. Ti pos cuntinuar cun la proxima.',
        5000
      );
    }, (error) => {
      console.error(error);
      this.notificationService.error(
        'Error durant acceptar',
        'La proposta na po betg vegnir acceptada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  rejectSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }

    this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion.entryId, this.selectedEntryVersion.version.version).subscribe((entry) => {
      this.selectedEntryVersion!.local_review_status = 'REJECTED';
      this.downOne();
      this.notificationService.success(
        'Refusà la proposta',
        'La proposta è vegnida refusada. Ti pos cuntinuar cun la proxima.',
        5000
      );
    }, (error) => {
      console.error(error);
      this.notificationService.error(
        'Error durant refusar',
        'La proposta na po betg vegnir refusada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  reviewLater() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }

    this.editorService.reviewEntryLater(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion.entryId, this.selectedEntryVersion.version.version).subscribe((entry) => {
      this.selectedEntryVersion!.local_review_status = 'LATER';
      this.downOne();
      this.notificationService.success(
        'Spustà la proposta',
        'La proposta è vegnida spustada a pli tard. Ti pos cuntinuar cun la proxima.',
        5000
      );
    }, (error) => {
      console.error(error);
      this.notificationService.error(
        'Error durant spustar',
        'La proposta na po betg vegnir spustada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  editSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }

    const currentId = this.selectedEntry.current?.versionId;
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
        entryVersionToChange: this.selectedEntryVersion.version.version,
        directlyLoadDetailView: true,
        replaceSuggestion: true,
        isAutomaticChange: true,
      },
      nzOnOk: () => {
        this.editorService.getEntry(this.languageSelectionService.getCurrentLanguage(), this.selectedEntryVersion!.entryId).subscribe(entry => {
          if (entry.current?.versionId === currentId) {
            this.replaceLemma(entry, true);
            this.selectedEntryVersion!.local_review_status = 'EDITED';
            this.notificationService.success(
              'Midà la proposta',
              'La proposta è vegnida midada. Ti las stos anc acceptar.',
              5000
            );
          } else {
            this.replaceLemma(entry, false);
            this.selectedEntryVersion!.local_review_status = 'ACCEPTED';
            this.notificationService.success(
              'Midà ed acceptà la proposta',
              'La proposta è vegnida midada ed acceptada. Ti pos cuntinuar cun la proxima.',
              5000
            );
            this.downOne();
          }
        }, error => {
          console.error(error);
          this.notificationService.error(
            'Error durant modifitgar',
            'La proposta na po betg vegnir modifitgada. Emprova per plaschair anc ina giada.',
            15000
          );
        });
      },
    });

    modal.afterClose.subscribe((evt) => {
      this.isWindowOpen = false;
    });
  }

  nounChangeOnlyMale() {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), 'NOUN', "1", this.selectedEntryVersion!.version.version.rmStichwort!).subscribe(values => {
      const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedEntry?.current)) as EntryVersionInternalDto;

      workingLemmaVersion.inflection = new Inflection();
      workingLemmaVersion.inflection.inflectionType = 'NOUN';
      workingLemmaVersion.inflection.noun = values.noun;
      workingLemmaVersion.automaticChange = true;

      this.editorService.replaceSuggestionWithSuggestion(
        this.languageSelectionService.getCurrentLanguage(),
        this.selectedEntry!.entryId,
        this.selectedEntryVersion!.version.version.versionId,
        workingLemmaVersion
      ).subscribe((entry) => {
        this.replaceLemma(entry, true);
        this.notificationService.success(
          'Midà la proposta',
          'La proposta è vegnida midada. Ti las stos anc acceptar.',
          5000
        );
      }, error => {
        console.error(error);
        this.notificationService.error(
          'Error durant modifitgar',
          'La proposta na po betg vegnir modifitgada. Emprova per plaschair anc ina giada.',
          15000
        );
      })
    });
  }

  adjectiveNoAdverbialForm() {
    const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedEntry?.current)) as EntryVersionInternalDto;

    workingLemmaVersion.inflection = new Inflection();
    workingLemmaVersion.inflection.inflectionType = 'ADJECTIVE';
    workingLemmaVersion.inflection.adjective = this.selectedEntryVersion!.version.version.inflection?.adjective;
    workingLemmaVersion.inflection.adjective!.adverbialForm = undefined;
    workingLemmaVersion.automaticChange = true;

    this.editorService.replaceSuggestionWithSuggestion(
      this.languageSelectionService.getCurrentLanguage(),
      this.selectedEntry!.entryId,
      this.selectedEntryVersion!.version.version.versionId,
      workingLemmaVersion
    ).subscribe((entry) => {
      this.replaceLemma(entry, true);
      this.notificationService.success(
        'Midà la proposta',
        'La proposta è vegnida midada. Ti las stos anc acceptar.',
        5000
      );
    }, error => {
      console.error(error);
      this.notificationService.error(
        'Error durant modifitgar',
        'La proposta na po betg vegnir modifitgada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  changePage(pageNumber: number)  {
    if (pageNumber > 0) {
      pageNumber--;
    }
    this.isLoadingData = true;
    this.editorService.getAllEntries(this.languageSelectionService.getCurrentLanguage(), this.searchCriteria!, pageNumber).subscribe(page => {
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

  private replaceLemma(entry: EntryDto, updateSuggestion = false) {
    this.selectedEntry = entry;

    if (updateSuggestion) {
      let version: EntryVersionInternalDto = new EntryVersionInternalDto();

      entry.suggestions.forEach((suggestion: EntryVersionInternalDto) => {
        if (suggestion.automaticChange) {
          version = suggestion;
        }
      });

      this.selectedEntryVersion = {
        entryId: entry.entryId,
        version: {
          entryId: entry.entryId,
          publicationStatus: 'HAS_SUGGESTION',
          version: version!
        },
        selected: true,
        local_review_status: 'EDITED',
      };
    } else {
      this.selectedEntryVersion = {
        entryId: entry.entryId,
        version: {
          entryId: entry.entryId,
          publicationStatus: 'HAS_SUGGESTION',
          version: entry.current!
        },
        selected: true,
        local_review_status: 'ACCEPTED',
      };
    }

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
