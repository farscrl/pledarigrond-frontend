import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Language } from '../models/security';

@Injectable({
  providedIn: 'root'
})
export class LanguageSelectionService {

  private currentLanguage: Language = Language.RUMANTSCHGRISCHUN;

  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.setNewUrl(val.url);
      }
    });
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
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  private setCurrentLanguage(language: Language) {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
    }
  }
}
