import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language } from '../models/security';
import { TranslateService } from '@ngx-translate/core';

export type FrontendLanguage = 'en' | 'rm';

@Injectable({
  providedIn: 'root'
})
export class LanguageSelectionService {
  private translateService = inject(TranslateService);


  private frontendLanguageSubject = new BehaviorSubject<FrontendLanguage>('rm');

  private currentLanguageSubject = new BehaviorSubject<Language>(Language.UNDEFINED);

  getFrontendLanguageObservable(): Observable<FrontendLanguage> {
    return this.frontendLanguageSubject.asObservable();
  }

  setFrontendLanguage(language: FrontendLanguage) {
    this.frontendLanguageSubject.next(language);
    this.changeUiLanguage();
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  public getCurrentLanguageObservable(): Observable<Language> {
    return this.currentLanguageSubject.asObservable();
  }

  public setCurrentLanguage(language: Language) {
    if (this.currentLanguageSubject.value !== language) {
      this.currentLanguageSubject.next(language);
      this.changeUiLanguage();
    }
  }

  private changeUiLanguage() {
    if (this.frontendLanguageSubject.getValue() === 'en') {
      this.translateService.use('en');
    } else {
      switch(this.currentLanguageSubject.value) {
        case Language.PUTER:
          this.translateService.use('rm-puter');
          break;
        case Language.RUMANTSCHGRISCHUN:
          this.translateService.use('rm-rumgr');
          break;
        case Language.SURMIRAN:
          this.translateService.use('rm-surmiran');
          break;
        case Language.SURSILVAN:
          this.translateService.use('rm-sursilv');
          break;
        case Language.SUTSILVAN:
          this.translateService.use('rm-sutsilv');
          break;
        case Language.VALLADER:
          this.translateService.use('rm-vallader');
          break;
      }
    }
  }
}
