import { Component, HostListener, OnInit } from '@angular/core';
import { LemmaVersionUi } from 'src/app/models/lemma-version';
import { LexEntry } from 'src/app/models/lex-entry';
import { EditorSearchCriteria, SearchCriteria } from 'src/app/models/search-criteria';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export enum KEY_CODE {
  ENTER = 13,
  ESCAPE = 27,
  SPACE = 32,
}


@Component({
  selector: 'app-review-auto-changes',
  templateUrl: './review-auto-changes.component.html',
  styleUrls: ['./review-auto-changes.component.scss']
})
export class ReviewAutoChangesComponent implements OnInit {

  isLoadingData = true;

  lemmas: LemmaVersionUi[] = [];
  selectedLemma?: LemmaVersionUi;
  selectedLexEntry?: LexEntry;

  searchCriteria: EditorSearchCriteria = new EditorSearchCriteria();

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == KEY_CODE.ENTER){
      this.acceptSelectedLemma();
    } else if (event.keyCode === KEY_CODE.ESCAPE) {
      this.rejectSelectedLemma();
    } else if (event.keyCode === KEY_CODE.SPACE) {
      this.editSelectedLemma();
    }
  }

  constructor(
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.searchCriteria.onlyAutomaticChanged = true;
    this.searchCriteria.suggestions = true;

    this.editorService.searchLemmaVersions(this.languageSelectionService.getCurrentLanguage(), this.searchCriteria!, 0).subscribe(page => {
      this.isLoadingData = false;
      this.lemmas = page.content as LemmaVersionUi[];
      this.jumpToNext();
    });
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
    this.selectedLemma.local_review_status = 'ACCEPTED';
    this.createNotification('success', this.selectedLexEntry.mostRecent.lemmaValues.RStichwort + " ⇔ " + this.selectedLexEntry.mostRecent.lemmaValues.DStichwort, "This change was accepted");
    this.jumpToNext();
  }

  rejectSelectedLemma() {
    if (!this.selectedLexEntry || !this.selectedLemma) {
      return;
    }
    this.selectedLemma.local_review_status = 'REJECTED';
    this.createNotification('error', this.selectedLexEntry.mostRecent.lemmaValues.RStichwort + " ⇔ " + this.selectedLexEntry.mostRecent.lemmaValues.DStichwort, "This change was rejected");
    this.jumpToNext();
  }

  editSelectedLemma() {
    if (!this.selectedLexEntry || !this.selectedLemma) {
      return;
    }
    this.selectedLemma.local_review_status = 'EDITED';
    this.createNotification('error', this.selectedLexEntry.mostRecent.lemmaValues.RStichwort + " ⇔ " + this.selectedLexEntry.mostRecent.lemmaValues.DStichwort, "This change was edited");
    this.jumpToNext();
  }

  createNotification(type: string, title: string, notification: string): void {
    this.notification.create(
      type,
      title,
      notification
    );
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
}
