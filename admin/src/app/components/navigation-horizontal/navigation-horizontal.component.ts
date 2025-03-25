import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { environment } from './../../../environments/environment';
import { Language } from "../../models/security";

@Component({
    selector: 'app-navigation-horizontal',
    templateUrl: './navigation-horizontal.component.html',
    styleUrls: ['./navigation-horizontal.component.scss'],
    standalone: false
})
export class NavigationHorizontalComponent implements OnInit {

  currentLanguage: Language = Language.UNDEFINED;

  constructor(
    public languageSelectionService: LanguageSelectionService,
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.languageSelectionService.getCurrentLanguageObservable().subscribe(l => {
      this.currentLanguage = l;
    });
  }

  openFe() {
    window.open(environment.frontendUrl + "/" + this.currentLanguage, '_blank');
  }

  showAutomaticReview(): boolean {
    return this.currentLanguage === 'sursilvan';
  }

  showPronunciationReview(): boolean {
    return true;
  }

  showFrontendLink(): boolean {
    return this.currentLanguage !== 'puter' && this.currentLanguage !== 'vallader';
  }
}
