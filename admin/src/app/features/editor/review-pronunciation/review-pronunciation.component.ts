import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListFilter } from '../../../models/registration-filter';
import { Registration, RegistrationStatus } from '../../../models/registration';
import { Page } from '../../../models/page';
import { RegistrationService } from '../../../services/registration.service';
import { EditorService } from '../../../services/editor.service';
import { Language } from '../../../models/security';
import { LanguageSelectionService } from '../../../services/language-selection.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AudioPlayerComponent } from '../../../components/audio-player/audio-player.component';
import { EntryVersionInternalDto } from '../../../models/dictionary';

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
  LEFT_ARROW = 37,
  P_KEY = 80,
}

@Component({
    selector: 'app-review-pronunciation',
    templateUrl: './review-pronunciation.component.html',
    styleUrl: './review-pronunciation.component.scss',
    standalone: false
})
export class ReviewPronunciationComponent implements OnInit, OnDestroy {
  filter: ListFilter = new ListFilter();
  currentPage: Page<Registration> = new Page();
  isLoadingData = true;

  // used to pass math functions to template
  math = Math;

  registrations: Registration[] = [];

  selectedRegistration?: Registration;

  private idiom: Language = Language.RUMANTSCHGRISCHUN;
  private idiomSubscription: any;

  entryVersions: EntryVersionInternalDto[] = [];

  @ViewChild(AudioPlayerComponent, { static: false })
  private audioPlayerComponent: AudioPlayerComponent | undefined;

  private ignoreKeyEvents = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.selectedRegistration || this.ignoreKeyEvents) {
      return;
    }
    /*if(event.keyCode == KEY_CODE.ENTER){
      this.acceptRegistration(this.selectedRegistration);
    } else if (event.keyCode === KEY_CODE.DELETE) {
      this.rejectRegistration(this.selectedRegistration);
    } else*/ if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.downOne();
    } else if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.upOne();
    }
  }

  constructor(
    private registrationService: RegistrationService,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private modal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.idiomSubscription = this.languageSelectionService.getCurrentLanguageObservable().subscribe(idiom => {
      this.idiom = idiom;
    });

    this.filter.status = 'IN_REVIEW';
    this.filter.ascending = true;

    this.changePage(0, true);
  }

  ngOnDestroy() {
    this.idiomSubscription?.unsubscribe();
  }

  changeStatus(status: RegistrationStatus) {
    this.filter.status = status;
    this.changePage(0, true);
  }

  changePage(pageNumber: number, jumpToTop = false) {
    if (pageNumber > 0) {
      pageNumber--;
    }
    this.isLoadingData = true;
    this.registrationService.getRegistrations(this.filter, pageNumber, 50).subscribe(page => {
      this.isLoadingData = false;
      this.currentPage = page as Page<Registration>;

      this.registrations = this.currentPage.content;

      if (!jumpToTop) {
        return;
      }
      if (this.registrations.length > 0) {
        this.selectRegistration(this.registrations[0]);
      } else {
        this.selectedRegistration = undefined;
      }
    });
  }

  selectRegistration(registration: Registration) {
    this.entryVersions = [];
    this.selectedRegistration = registration;

    // running this in a timeout to make sure the audio player is ready
    setTimeout(() => {
      if (this.audioPlayerComponent) {
        this.audioPlayerComponent.play();
      }
    }, 20);

    registration.lemmaIds?.forEach(lemmaId => {
      this.editorService.getEntry(this.idiom, lemmaId).subscribe(lexEntry => {
        if (lexEntry.current) {
          this.entryVersions.push(lexEntry.current);
        }
      });
    });
  }

  acceptRegistration(registration: Registration) {
    this.registrationService.acceptRegistration(registration).subscribe(() => {
      this.downOne();
      this.changePage(this.currentPage.number);
    });
  }

  rejectRegistration(registration: Registration) {
    this.ignoreKeyEvents = true;
    const reviewerComment = prompt('Remartga per la pledadra');

    // 'cancel' or 'esc'-key
    if (reviewerComment === null) {
      setTimeout(() => {
        this.ignoreKeyEvents = false;
      }, 50);
      return;
    }

    registration.reviewerComment = reviewerComment || '';
    this.registrationService.rejectRegistration(registration).subscribe(() => {
      setTimeout(() => {
        this.ignoreKeyEvents = false;
      }, 50);
      this.downOne();
      this.changePage(this.currentPage.number);
    });
  }

  reviewLater(registration: Registration) {
    this.registrationService.postponeReviewRegistration(registration).subscribe(() => {
      this.downOne();
      this.changePage(this.currentPage.number);
    });
  }

  delete(registration: Registration) {
    this.modal.confirm({
      nzTitle: 'Vuls ti propi stizzar la pronunzia «' + registration.rmStichwort + '»?',
      nzOkText: 'Stizzar',
      nzCancelText: 'Interrumper',
      nzOnOk: () => {
        this.registrationService.deleteRegistration(registration).subscribe(() => {
          this.downOne();
          this.changePage(this.currentPage.number);
        });
      }
    });

  }

  getAudioUrl(registration: Registration) {
    return this.registrationService.getMp3UrlByRegistration(registration);
  }

  showPlayButton(status: RegistrationStatus) {
    return status === 'IN_REVIEW' || status === 'POSTPONED_REVIEW' || status === 'COMPLETED' || status === 'REFUSED';
  }

  showAcceptButton(status: RegistrationStatus) {
    return status === 'IN_REVIEW' || status === 'POSTPONED_REVIEW' || status === 'REFUSED';
  }

  showRejectButton(status: RegistrationStatus) {
    return status === 'IN_REVIEW' || status === 'POSTPONED_REVIEW' || status === 'COMPLETED';
  }

  showPostponeButton(status: RegistrationStatus) {
    return status === 'IN_REVIEW';
  }

  private upOne() {
    if (!this.selectedRegistration) {
      return;
    }

    const sl = this.selectedRegistration;
    const idx = this.registrations.findIndex(el => el.id === sl.id);

    if (idx - 1 > -1) {
      this.selectRegistration(this.registrations[idx-1]);
    }
  }

  private downOne() {
    if (!this.selectedRegistration) {
      return;
    }

    const sl = this.selectedRegistration;
    const idx = this.registrations.findIndex(el => el.id === sl.id);

    if (idx + 1 < this.registrations.length) {
      this.selectRegistration(this.registrations[idx+1]);
    }
  }
}
