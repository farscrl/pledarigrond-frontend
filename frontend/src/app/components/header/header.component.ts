import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, throwIfEmpty } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  loggedInUser = "";

  private loggedInSubscription: Subscription|null = null;
  private usernameSubscription: Subscription|null = null;

  constructor(private authService: AuthService, private router: Router, private selectedLanguageService: SelectedLanguageService) { }

  ngOnInit(): void {
    this.loggedInSubscription = this.authService.getLoggedInObservable().subscribe(value => this.isLoggedIn = value);
    this.usernameSubscription = this.authService.getUsernameObservable().subscribe(value => this.loggedInUser = value);
  }

  ngOnDestroy(): void {
      if (this.loggedInSubscription) {
        this.loggedInSubscription.unsubscribe();
      }
      if (this.usernameSubscription) {
        this.usernameSubscription.unsubscribe();
      }
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.router.navigate([this.selectedLanguageService.getSelectedLanguageUrlSegment() + "/login"]);
  }
}
