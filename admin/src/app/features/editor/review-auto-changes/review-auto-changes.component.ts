import { Component, HostListener, OnInit, ViewContainerRef } from '@angular/core';
import { LemmaVersionUi } from 'src/app/models/lemma-version';
import { LexEntry } from 'src/app/models/lex-entry';
import { EditorSearchCriteria, SearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { MainEntryComponent } from '../../modify-entry/main-entry/main-entry.component';
import { Page } from 'src/app/models/page';
import { InflectionType } from 'src/app/models/inflection';
import { InflectionService } from 'src/app/services/inflection.service';

export enum KEY_CODE {
  KEY1 = 49,
  KEY2 = 50,
  KEY3 = 51,
  ENTER = 13,
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
  styleUrls: ['./review-auto-changes.component.scss']
})
export class ReviewAutoChangesComponent implements OnInit {

  isLoadingData = true;
  isWindowOpen = false;

  currentPage: Page<LemmaVersionUi> = new Page();
  lemmas: LemmaVersionUi[] = [];
  selectedLemma?: LemmaVersionUi;
  selectedLexEntry?: LexEntry;

  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.isWindowOpen || !this.selectedLemma) {
      return;
    }
    if(event.keyCode == KEY_CODE.ENTER){
      this.acceptSelectedLemma();
    } else if (event.keyCode === KEY_CODE.ESCAPE) {
      this.rejectSelectedLemma();
    } else if (event.keyCode === KEY_CODE.SPACE) {
      this.editSelectedLemma();
    } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.downOne();
    } else if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.upOne();
    }
    if (this.selectedLexEntry && this.selectedLexEntry.mostRecent.lemmaValues.RGrammatik === 'subst') {
      if(event.keyCode == KEY_CODE.KEY1){
        this.nounChangeOnlyMale();
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
    this.searchCriteria.onlyAutomaticChanged = true;
    this.searchCriteria.suggestions = true;
    this.searchCriteria.searchDirection = 'ROMANSH';
    this.searchCriteria.verification = 'UNVERIFIED';

    this.changePage(0);
  }

  ngAfterViewChecked() {
    if (!this.selectedLemma) {
      return;
    }
    const el =  document.querySelector('#list-id-' + this.selectedLemma.lexEntryId);
    if (el) {
      el.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });
    }
  }

  selectLemma(lemma: LemmaVersionUi) {
    if (lemma.selected) {
      this.selectedLexEntry = undefined;
      lemma.selected = false;
      this.selectedLemma = undefined;
      return;
    }

    this.deselectAll();
    lemma.selected = true;
    this.selectedLemma = lemma;
    this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), lemma.lexEntryId).subscribe(entry => {
      this.selectedLexEntry = entry;
    });
  }

  acceptSelectedLemma() {
    if (!this.selectedLexEntry || !this.selectedLemma) {
      return;
    }
    const lemma = this.selectedLemma;
    this.editorService.acceptVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedLemma.lexEntryId, this.selectedLemma).subscribe((entry) => {
      lemma.local_review_status = 'ACCEPTED';
      this.createNotification('success', lemma.lemmaValues.RStichwort + " ⇔ " + lemma.lemmaValues.DStichwort, "This change was accepted");
      this.downOne();
    }, (error) => {
      console.error(error);
    });
  }

  rejectSelectedLemma() {
    if (!this.selectedLexEntry || !this.selectedLemma) {
      return;
    }
    const lemma = this.selectedLemma;
    this.editorService.rejectVersion(this.languageSelectionService.getCurrentLanguage(), this.selectedLemma.lexEntryId, this.selectedLemma).subscribe((entry) => {
      lemma.local_review_status = 'REJECTED';
      this.createNotification('error', lemma.lemmaValues.RStichwort + " ⇔ " + lemma.lemmaValues.DStichwort, "This change was rejected");
      this.downOne();
    }, (error) => {
      console.error(error);
    });
  }

  editSelectedLemma() {
    if (!this.selectedLexEntry || !this.selectedLemma) {
      return;
    }
    const lemma = this.selectedLemma;

    this.isWindowOpen = true;
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.titles.edit'),
      nzContent: MainEntryComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lexEntryId: lemma.lexEntryId,
      },
      nzOnOk: () => {
        lemma.local_review_status = 'EDITED';
        this.createNotification('error', lemma.lemmaValues.RStichwort + " ⇔ " + lemma.lemmaValues.DStichwort, "This change was edited");
        this.downOne();
      },
    });
    modal.afterClose.subscribe(() => {
      this.isWindowOpen = false;
    });
  }

  nounChangeOnlyMale() {
    this.generateNewInflection('NOUN', "1", this.selectedLemma!.lemmaValues.RStichwort!);
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
      this.currentPage = page as Page<LemmaVersionUi>;
      this.lemmas = page.content as LemmaVersionUi[];
      this.jumpToNext();
    });
  }

  private deselectAll() {
    this.lemmas.forEach(lemma => {
      lemma.selected = false;
    });
  }

  private jumpToNext() {
    for(let i = 0; i < this.lemmas.length; i++) {
      const lemma = this.lemmas[i];
      if (!lemma.local_review_status || lemma.local_review_status === 'UNDEFINED') {
        this.selectLemma(lemma);
        return;
      }
    }
  }

  private upOne() {
    if (!this.selectedLemma) {
      return;
    }

    const idx = this.lemmas.indexOf(this.selectedLemma);

    if (idx - 1 > -1) {
      this.selectLemma(this.lemmas[idx-1]);
    }
  }

  private downOne() {
    if (!this.selectedLemma) {
      return;
    }

    const idx = this.lemmas.indexOf(this.selectedLemma);

    if (idx + 1 < this.lemmas.length) {
      this.selectLemma(this.lemmas[idx+1]);
    }
  }

  private generateNewInflection(type: InflectionType, subTypeId: string, baseForm: string) {
    this.inflectionService.getInflectionForms(this.languageSelectionService.getCurrentLanguage(), type, subTypeId, baseForm).subscribe(values => {
      const workingLemmaVersion = JSON.parse(JSON.stringify(this.selectedLexEntry?.mostRecent));
      workingLemmaVersion.lemmaValues.RInflectionSubtype = subTypeId;

      // reset automaticly created values
      delete workingLemmaVersion.pgValues.timestamp;
      delete workingLemmaVersion.timestamp;
      delete workingLemmaVersion.userId;
      delete workingLemmaVersion.pgValues.creator;

      workingLemmaVersion.lemmaValues = {
        ...workingLemmaVersion.lemmaValues,
        ...values.inflectionValues
      };
      this.editorService.modifyLexEntry(this.languageSelectionService.getCurrentLanguage(), this.selectedLexEntry!.id!, workingLemmaVersion).subscribe((entry) => {
        this.selectedLexEntry = entry;
      })
    });
  }
}
