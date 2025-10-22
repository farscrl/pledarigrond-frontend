import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type FrontendLanguage = 'de'|'rm';
export type Idiom = 'puter'|'rumgr'|'surmiran'|'sursilv'|'sutsilv'|'vallader';
@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {
  private router = inject(Router);
  private translateService = inject(TranslateService);


  private frontendLanguageSubject = new BehaviorSubject<FrontendLanguage>('rm');
  private idiomSubject = new BehaviorSubject<Idiom>('rumgr');

  constructor() {
    const router = this.router;

    router.events.subscribe((data) => {
      if(data instanceof NavigationEnd) {
        this.changeIdiomBasedOnUrl(data.urlAfterRedirects);
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

  getIdiomObservable(): Observable<Idiom> {
    return this.idiomSubject.asObservable();
  }

  setIdiom(idiom: Idiom) {
    if (idiom === this.idiomSubject.getValue()) {
      // do nothing if idiom isnt changed
      return;
    }
    this.idiomSubject.next(idiom);
    this.changeUiLanguage();
  }

  getSelectedLanguageUrlSegment(): string {
    switch(this.idiomSubject.getValue()) {
      case 'puter':
      case 'surmiran':
      case 'vallader':
        return this.idiomSubject.getValue();
      case 'rumgr':
        return 'rumantschgrischun';
      case 'sursilv':
        return 'sursilvan';
      case 'sutsilv':
        return 'sutsilvan';
    }
  }

  private changeUiLanguage() {
    if (this.frontendLanguageSubject.getValue() === 'de') {
      this.translateService.use('de');
    } else {
      this.translateService.use('rm-' + this.idiomSubject.getValue());
    }
  }

  private changeIdiomBasedOnUrl(url: string) {
    switch(this.getUrlSegment(url)) {
      case "puter":
        this.setIdiom('puter');
        return;
      case "rumantschgrischun":
          this.setIdiom('rumgr');
          return;
      case "surmiran":
        this.setIdiom('surmiran');
        return;
      case "sursilvan":
        this.setIdiom('sursilv');
        return;
      case "sutsilvan":
        this.setIdiom('sutsilv');
        return;
      case "vallader":
        this.setIdiom('vallader');
        return;
      default:
        return;
    }
  }

  private getUrlSegment(url: string): string|null {
    const segments = url.split('/');
    if (segments.length < 2) {
      return null;
    }
    const subsegments = segments[1].split('?');
    return subsegments[0];
  }
}
