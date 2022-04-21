import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  loggedInUser = "";
  loggedInUserShort = "";
  hasEditorRights = false;
  frontendLanguage: FrontendLanguage = 'rm';

  private loggedInSubscription: Subscription|null = null;
  private usernameSubscription: Subscription|null = null;
  private editorRightsSubscription: Subscription|null = null;
  private frontendLanguageSubscription: Subscription|null = null;

  constructor(private authService: AuthService, private router: Router, public selectedLanguageService: SelectedLanguageService) { }

  ngOnInit(): void {
    this.loggedInSubscription = this.authService.getLoggedInObservable().subscribe(value => this.isLoggedIn = value);
    this.usernameSubscription = this.authService.getUsernameObservable().subscribe(value => this.generateUserNames(value));
    this.editorRightsSubscription = this.authService.hasEditorRightsObservable().subscribe(value => this.hasEditorRights = value);
    this.frontendLanguageSubscription = this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => this.frontendLanguage = value);
  }

  ngOnDestroy(): void {
      if (this.loggedInSubscription) {
        this.loggedInSubscription.unsubscribe();
      }
      if (this.usernameSubscription) {
        this.usernameSubscription.unsubscribe();
      }
      if (this.editorRightsSubscription) {
        this.editorRightsSubscription.unsubscribe();
      }
      if (this.frontendLanguageSubscription) {
        this.frontendLanguageSubscription?.unsubscribe();
      }
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.router.navigate([this.selectedLanguageService.getSelectedLanguageUrlSegment() + "/login"]);
  }

  goToBackend() {
    if (this.hasEditorRights) {
      document.location.href = environment.adminBackendUrl;
    }
  }

  changeFrontendLanguage(language: FrontendLanguage) {
    this.selectedLanguageService.setFrontendLanguage(language);
  }

  private generateUserNames(name: string) {
    this.loggedInUser = name;
    this.loggedInUserShort = name.replace('/[^\w+]/g', name);
		this.loggedInUserShort = this.loggedInUserShort.substring(0, 2);
  }
}
