import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FrontendLanguage, LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
    selector: 'app-ladin-header',
    templateUrl: './header-ladin.component.html',
    styleUrls: ['./header-ladin.component.scss'],
    standalone: false
})
export class HeaderLadinComponent implements OnInit {

  frontendLanguage: FrontendLanguage = 'rm';

  private frontendLanguageSubscription: Subscription|null = null;

  constructor(public authService: AuthService, private router: Router, public languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.frontendLanguageSubscription = this.languageSelectionService.getFrontendLanguageObservable().subscribe(value => this.frontendLanguage = value);
  }

  ngOnDestroy(): void {
    if (this.frontendLanguageSubscription) {
      this.frontendLanguageSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeFrontendLanguage(language: FrontendLanguage) {
    this.languageSelectionService.setFrontendLanguage(language);
  }
}
