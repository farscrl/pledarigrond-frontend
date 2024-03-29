import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language } from '../models/security';
import { TranslateService } from '@ngx-translate/core';

export type FrontendLanguage = 'en' | 'rm';

@Injectable({
  providedIn: 'root'
})
export class LanguageSelectionService {

  private frontendLanguageSubject = new BehaviorSubject<FrontendLanguage>('rm');

  private currentLanguageSubject = new BehaviorSubject<Language>(Language.UNDEFINED);

  constructor(private router: Router, private translateService: TranslateService) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.setNewUrl(val.url);
      }
      if (val instanceof Scroll) {
        this.setNewUrl(val.routerEvent.url);
      }
    });
  }

  getFrontendLanguageObservable(): Observable<FrontendLanguage> {
    return this.frontendLanguageSubject.asObservable();
  }

  setFrontendLanguage(language: FrontendLanguage) {
    this.frontendLanguageSubject.next(language);
    this.changeUiLanguage();
  }

  public setNewUrl(url: string) {
    const segments = url.split('/');

    if (segments.length >= 3) {
      switch(segments[2]) {
        case "puter":
          this.setCurrentLanguage(Language.PUTER);
          break;
        case "rumantschgrischun":
          this.setCurrentLanguage(Language.RUMANTSCHGRISCHUN);
          break;
        case "surmiran":
          this.setCurrentLanguage(Language.SURMIRAN);
          break;
        case "sursilvan":
          this.setCurrentLanguage(Language.SURSILVAN);
          break;
        case "sutsilvan":
          this.setCurrentLanguage(Language.SUTSILVAN);
          break;
        case "vallader":
          this.setCurrentLanguage(Language.VALLADER);
          break;
      }
    }

    this.changeUiLanguage();
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  public getCurrentLanguageObservable(): Observable<Language> {
    return this.currentLanguageSubject.asObservable();
  }

  private setCurrentLanguage(language: Language) {
    if (this.currentLanguageSubject.value !== language) {
      this.currentLanguageSubject.next(language);
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
