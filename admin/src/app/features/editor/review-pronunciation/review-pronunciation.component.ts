import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ListFilter } from '../../../models/registration-filter';
import { Registration, RegistrationStatus } from '../../../models/registration';
import { Page } from '../../../models/page';
import { RegistrationService } from '../../../services/registration.service';

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
  selector: 'app-review-pronunciation',
  templateUrl: './review-pronunciation.component.html',
  styleUrl: './review-pronunciation.component.scss'
})
export class ReviewPronunciationComponent {
  filter: ListFilter = new ListFilter();
  currentPage: Page<Registration> = new Page();
  isLoadingData = true;

  // used to pass math functions to template
  math = Math;

  registrations: Registration[] = [];

  selectedRegistration?: Registration;

  @ViewChild('audioControl') audioControl!: ElementRef<HTMLAudioElement>;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if ( !this.selectedRegistration) {
      return;
    }
    if(event.keyCode == KEY_CODE.ENTER){
      this.acceptRegistration(this.selectedRegistration);
    } else if (event.keyCode === KEY_CODE.DELETE) {
      this.rejectRegistration(this.selectedRegistration);
    } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.downOne();
    } else if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.upOne();
    }
  }

  constructor(
    private registrationService: RegistrationService,
  ) {
  }

  ngOnInit(): void {
    this.filter.status = 'IN_REVIEW';
    this.filter.ascending = true;

    this.changePage(0);
  }

  changeStatus(status: RegistrationStatus) {
    this.filter.status = status;
    this.changePage(0);
  }

  changePage(pageNumber: number)  {
    if (pageNumber > 0) {
      pageNumber--;
    }
    this.isLoadingData = true;
    this.registrationService.getRegistrations(this.filter, pageNumber, 50).subscribe(page => {
      this.isLoadingData = false;
      this.currentPage = page as Page<Registration>;

      this.registrations = this.currentPage.content;
    });
  }

  selectRegistration(registration: Registration) {
    this.selectedRegistration = registration;

    this.play(registration);
  }

  acceptRegistration(registration: Registration) {
    this.registrationService.acceptRegistration(registration).subscribe(() => {
      this.downOne();
      this.changePage(this.currentPage.number);
    });
  }

  rejectRegistration(registration: Registration) {
    const reviewerComment = prompt('Remartga al plidader');

    registration.reviewerComment = reviewerComment || '';
    this.registrationService.rejectRegistration(registration).subscribe(() => {
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

  async play(registration: Registration) {
    const audioElement = this.audioControl.nativeElement;
    audioElement.src = this.registrationService.getMp3Url(registration);
    audioElement.load();
    await audioElement.play();
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
