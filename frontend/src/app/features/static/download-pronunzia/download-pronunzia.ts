import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ExportService } from '../../../services/export.service';
import { FrontendLanguage, Idiom, SelectedLanguageService } from '../../../services/selected-language.service';

export type ErrorType = 'no-idiom' | 'no-terms' | 'invalid-email' | 'server-error';

@Component({
  selector: 'app-download-pronunzia',
  imports: [FormsModule],
  templateUrl: './download-pronunzia.html',
  styleUrl: './download-pronunzia.scss'
})
export class DownloadPronunzia implements OnInit, OnDestroy {
  private exportService = inject(ExportService);
  private selectedLanguageService = inject(SelectedLanguageService);
  private languageSubscription?: Subscription;

  frontEndLanguage: FrontendLanguage = 'rm';
  selectedIdiom: Idiom | '' = '';
  acceptedTerms = false;
  email = '';
  errorType: ErrorType | null = null;
  showSuccess = false;
  isLoading = false;

  ngOnInit(): void {
    this.languageSubscription = this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => {
      this.frontEndLanguage = value;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  sendRequest(): void {
    this.errorType = null;
    this.showSuccess = false;

    if (!this.selectedIdiom) {
      this.errorType = 'no-idiom';
      return;
    }

    if (!this.acceptedTerms) {
      this.errorType = 'no-terms';
      return;
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      this.errorType = 'invalid-email';
      return;
    }

    this.isLoading = true;

    const languageUrlSegment = this.selectedLanguageService.getUrlSegmentForIdiom(this.selectedIdiom);
    this.exportService.requestPronunciationDownloadLink(languageUrlSegment, this.email, this.acceptedTerms).subscribe({
      next: () => {
        this.isLoading = false;
        this.selectedIdiom = '';
        this.showSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorType = 'server-error';
        console.error(error);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) !== null;
  }
}
