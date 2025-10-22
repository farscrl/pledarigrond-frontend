import { Component, HostListener, OnInit, ViewContainerRef, inject } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MainEntryComponent } from '../../modify-entry/main-entry/main-entry.component';
import { Page } from 'src/app/models/page';
import { InflectionService } from 'src/app/services/inflection.service';
import { Language } from "../../../models/security";
import { ReferenceVerbDto } from '../../../models/reference-verb-dto';
import {
  EntryDto,
  EntryVersionInternalDto,
  Inflection,
  NormalizedEntryVersionDto,
  Verb
} from '../../../models/dictionary';
import { AutoReviewListItem } from '../../../models/dictionary-list';
import { DbSearchCriteria } from '../../../models/db-search-criteria';
import { NotificationService } from '../../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { NzPageHeaderTitleDirective, NzPageHeaderComponent, NzPageHeaderExtraDirective } from 'ng-zorro-antd/page-header';
import { NzRadioGroupComponent, NzRadioComponent } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzListComponent, NzListItemComponent, NzListItemMetaComponent, NzListItemMetaTitleComponent } from 'ng-zorro-antd/list';

import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { LemmaDiffComponent } from '../../../components/lemma-diff/lemma-diff.component';

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
    imports: [NzRowDirective, NzColDirective, NzContentComponent, NzPageHeaderTitleDirective, NzRadioGroupComponent, FormsModule, NzRadioComponent, NzSpaceCompactItemDirective, NzInputDirective, NzCheckboxComponent, NzSelectComponent, NzOptionComponent, NzPageHeaderComponent, NzListComponent, NzListItemComponent, ɵNzTransitionPatchDirective, NzIconDirective, NzListItemMetaComponent, NzListItemMetaTitleComponent, NzPaginationComponent, NzPageHeaderExtraDirective, NzButtonComponent, NzWaveDirective, LemmaDiffComponent, TranslatePipe]
})
export class ReviewAutoChangesComponent implements OnInit {
  private editorService = inject(EditorService);
  private languageSelectionService = inject(LanguageSelectionService);
  private modalService = inject(NzModalService);
  private translateService = inject(TranslateService);
  private viewContainerRef = inject(ViewContainerRef);
  private inflectionService = inject(InflectionService);
  private notificationService = inject(NotificationService);


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
    /*if(event.keyCode == KEY_CODE.ENTER){
      this.acceptSelectedLemma();
    } else if (event.keyCode === KEY_CODE.DELETE) {
      this.rejectSelectedLemma();
    } else if (event.keyCode === KEY_CODE.SPACE) {
      this.editSelectedLemma();
    } else*/ if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.downOne();
    } else if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.upOne();
    }
    /*if (this.selectedEntry && this.selectedEntryVersion.version.version.inflection?.inflectionType === 'NOUN') {
      if(event.keyCode == KEY_CODE.KEY1){
        this.nounChangeOnlyMale();
      }
    }

    if (this.selectedEntry && this.selectedEntryVersion.version.version.inflection?.inflectionType === 'ADJECTIVE') {
      if(event.keyCode == KEY_CODE.KEY1){
        this.adjectiveNoAdverbialForm();
      }
    }*/
  }

  private cancelPreviousRequest = new Subject<void>();

  // used to pass math functions to template
  math = Math;

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
        'Errur durant acceptar',
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
        'Errur durant refusar',
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
        'Errur durant spustar',
        'La proposta na po betg vegnir spustada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  editSelectedLemma() {
    if (!this.selectedEntry || !this.selectedEntryVersion) {
      return;
    }
    const replaceSuggestion = this.selectedEntryVersion.local_review_status !== 'ACCEPTED';

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
        entryVersionToChange: this.selectedEntryVersion.version.version,
        directlyLoadDetailView: true,
        replaceSuggestion: replaceSuggestion,
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
            'Errur durant modifitgar',
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
          'Errur durant modifitgar',
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
        'Errur durant modifitgar',
        'La proposta na po betg vegnir modifitgada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  copyReference() {
    const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedEntry?.current)) as EntryVersionInternalDto;

    workingLemmaVersion.inflection = new Inflection();
    workingLemmaVersion.inflection.inflectionType = 'VERB';
    workingLemmaVersion.inflection.verb = JSON.parse(JSON.stringify(this.selectedEntryVersion!.version.version.inflection?.verb)) as Verb;
    workingLemmaVersion.automaticChange = true;

    const verb = workingLemmaVersion.inflection.verb!;
    verb.infinitiv = this.referenceInflection?.infinitiv;
    verb.irregular = true;
    verb.preschent = {
      sing1: this.referenceInflection?.preschentsing1,
      sing2: this.referenceInflection?.preschentsing2,
      sing3: this.referenceInflection?.preschentsing3,
      plural1: this.referenceInflection?.preschentplural1,
      plural2: this.referenceInflection?.preschentplural2,
      plural3: this.referenceInflection?.preschentplural3,
    }

    verb.imperativ = {
      singular: this.referenceInflection?.imperativ1,
      plural: this.referenceInflection?.imperativ2,
    }

    verb.participPerfect = {
      ms: this.referenceInflection?.participperfectms,
      fs: this.referenceInflection?.participperfectfs,
      mp: this.referenceInflection?.participperfectmp,
      fp: this.referenceInflection?.participperfectfp,
      msPredicativ: this.referenceInflection?.participperfectneut,
    }

    verb.gerundium = this.referenceInflection?.gerundium;

    verb.imperfect = {
      sing1: this.referenceInflection?.imperfectsing1,
      sing2: this.referenceInflection?.imperfectsing2,
      sing3: this.referenceInflection?.imperfectsing3,
      plural1: this.referenceInflection?.imperfectplural1,
      plural2: this.referenceInflection?.imperfectplural2,
      plural3: this.referenceInflection?.imperfectplural3,
    }

    verb.cundiziunal = {
      sing1: this.referenceInflection?.cundizionalsing1,
      sing2: this.referenceInflection?.cundizionalsing2,
      sing3: this.referenceInflection?.cundizionalsing3,
      plural1: this.referenceInflection?.cundizionalplural1,
      plural2: this.referenceInflection?.cundizionalplural2,
      plural3: this.referenceInflection?.cundizionalplural3,
    }

    verb.cundiziunalIndirect = {
      sing1: this.referenceInflection?.cundizionalindsing1,
      sing2: this.referenceInflection?.cundizionalindsing2,
      sing3: this.referenceInflection?.cundizionalindsing3,
      plural1: this.referenceInflection?.cundizionalindplural1,
      plural2: this.referenceInflection?.cundizionalindplural2,
      plural3: this.referenceInflection?.cundizionalindplural3,
    }

    verb.conjunctiv = {
      sing1: this.referenceInflection?.conjunctivsing1,
      sing2: this.referenceInflection?.conjunctivsing2,
      sing3: this.referenceInflection?.conjunctivsing3,
      plural1: this.referenceInflection?.conjunctivplural1,
      plural2: this.referenceInflection?.conjunctivplural2,
      plural3: this.referenceInflection?.conjunctivplural3,
    }

    verb.conjunctivImperfect = {
      sing1: this.referenceInflection?.conjunctivimpsing1,
      sing2: this.referenceInflection?.conjunctivimpsing2,
      sing3: this.referenceInflection?.conjunctivimpsing3,
      plural1: this.referenceInflection?.conjunctivimpplural1,
      plural2: this.referenceInflection?.conjunctivimpplural2,
      plural3: this.referenceInflection?.conjunctivimpplural3,
    }

    this.addPronouns(verb);

    this.editorService.replaceSuggestionWithSuggestion(
      this.languageSelectionService.getCurrentLanguage(),
      this.selectedEntry!.entryId,
      this.selectedEntryVersion!.version.version.versionId,
      workingLemmaVersion
    ).subscribe((entry) => {
      this.replaceLemma(entry, true);
      this.notificationService.success(
        'Copià la referenza',
        'La referenza è vegnida copiada. Ti las stos anc acceptar.',
        5000
      );
    }, error => {
      console.error(error);
      this.notificationService.error(
        'Errur durant copiar',
        'La proposta na po betg vegnir modifitgada. Emprova per plaschair anc ina giada.',
        15000
      );
    });
  }

  changePage(pageNumber: number)  {
    if (pageNumber > 0) {
      pageNumber--;
    }
    this.cancelPreviousRequest.next();

    this.isLoadingData = true;
    this.editorService.getAllEntries(this.languageSelectionService.getCurrentLanguage(), this.searchCriteria!, pageNumber).pipe(
      takeUntil(this.cancelPreviousRequest)
    ).subscribe(page => {
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

  private addPronouns(verb: Verb): void {
    // PRESCHENT
    verb.preschent!.sing1 = this.setPronoun("jeu ", verb.preschent!.sing1!);
    verb.preschent!.sing2 = this.setPronoun("ti ", verb.preschent!.sing2!);
    verb.preschent!.sing3 = this.setPronoun("el/ella ", verb.preschent!.sing3!);
    verb.preschent!.plural1 = this.setPronoun("nus ", verb.preschent!.plural1!);
    verb.preschent!.plural2 = this.setPronoun("vus ", verb.preschent!.plural2!);
    verb.preschent!.plural3 = this.setPronoun("els/ellas ", verb.preschent!.plural3!);

    // IMPERFECT
    verb.imperfect!.sing1 = this.setPronoun("jeu ", verb.imperfect!.sing1!);
    verb.imperfect!.sing2 = this.setPronoun("ti ", verb.imperfect!.sing2!);
    verb.imperfect!.sing3 = this.setPronoun("el/ella ", verb.imperfect!.sing3!);
    verb.imperfect!.plural1 = this.setPronoun("nus ", verb.imperfect!.plural1!);
    verb.imperfect!.plural2 = this.setPronoun("vus ", verb.imperfect!.plural2!);
    verb.imperfect!.plural3 = this.setPronoun("els/ellas ", verb.imperfect!.plural3!);

    // CONJUNCTIV
    verb.conjunctiv!.sing1 = this.setPronoun("che " + "jeu ", verb.conjunctiv!.sing1!);
    verb.conjunctiv!.sing2 = this.setPronoun("che " + "ti ", verb.conjunctiv!.sing2!);
    verb.conjunctiv!.sing3 = this.setPronoun("ch'" + "el/ella ", verb.conjunctiv!.sing3!);
    verb.conjunctiv!.plural1 = this.setPronoun("che " + "nus ", verb.conjunctiv!.plural1!);
    verb.conjunctiv!.plural2 = this.setPronoun("che " + "vus ", verb.conjunctiv!.plural2!);
    verb.conjunctiv!.plural3 = this.setPronoun("ch'" + "els/ellas ", verb.conjunctiv!.plural3!);

    // CONJUNCTIV IMPERFECT
    verb.conjunctivImperfect!.sing1 = this.setPronoun("che " + "jeu ", verb.conjunctivImperfect!.sing1!);
    verb.conjunctivImperfect!.sing2 = this.setPronoun("che " + "ti ", verb.conjunctivImperfect!.sing2!);
    verb.conjunctivImperfect!.sing3 = this.setPronoun("ch'" + "el/ella ", verb.conjunctivImperfect!.sing3!);
    verb.conjunctivImperfect!.plural1 = this.setPronoun("che " + "nus ", verb.conjunctivImperfect!.plural1!);
    verb.conjunctivImperfect!.plural2 = this.setPronoun("che " + "vus ", verb.conjunctivImperfect!.plural2!);
    verb.conjunctivImperfect!.plural3 = this.setPronoun("ch'" + "els/ellas ", verb.conjunctivImperfect!.plural3!);

    // CUNDIZIONAL
    verb.cundiziunal!.sing1 = this.setPronoun("jeu ", verb.cundiziunal!.sing1!);
    verb.cundiziunal!.sing2 = this.setPronoun("ti ", verb.cundiziunal!.sing2!);
    verb.cundiziunal!.sing3 = this.setPronoun("el/ella ", verb.cundiziunal!.sing3!);
    verb.cundiziunal!.plural1 = this.setPronoun("nus ", verb.cundiziunal!.plural1!);
    verb.cundiziunal!.plural2 = this.setPronoun("vus ", verb.cundiziunal!.plural2!);
    verb.cundiziunal!.plural3 = this.setPronoun("els/ellas ", verb.cundiziunal!.plural3!);

    // CUNDIZIONAL INDIRECT
    verb.cundiziunalIndirect!.sing1 = this.setPronoun("jeu ", verb.cundiziunalIndirect!.sing1!);
    verb.cundiziunalIndirect!.sing2 = this.setPronoun("ti ", verb.cundiziunalIndirect!.sing2!);
    verb.cundiziunalIndirect!.sing3 = this.setPronoun("el/ella ", verb.cundiziunalIndirect!.sing3!);
    verb.cundiziunalIndirect!.plural1 = this.setPronoun("nus ", verb.cundiziunalIndirect!.plural1!);
    verb.cundiziunalIndirect!.plural2 = this.setPronoun("vus ", verb.cundiziunalIndirect!.plural2!);
    verb.cundiziunalIndirect!.plural3 = this.setPronoun("els/ellas ", verb.cundiziunalIndirect!.plural3!);
  }

  private setPronoun(pronoun: string, forms: string): string {
    const singleForms = forms.split(/\r?\n/).map(f => pronoun + f);
    return singleForms.join("\n");
  }
}
