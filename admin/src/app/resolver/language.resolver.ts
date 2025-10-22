import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LanguageSelectionService } from '../services/language-selection.service';
import { Language } from '../models/security';

@Injectable({ providedIn: 'root' })
export class LanguageResolver implements Resolve<void> {
  private languageSelectionService = inject(LanguageSelectionService);


  resolve(route: ActivatedRouteSnapshot): void {
    const lang: Language = route.data['currentLanguage'];
    this.languageSelectionService.setCurrentLanguage(lang);
  }
}
