import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FrontendLanguage, LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzHeaderComponent } from 'ng-zorro-antd/layout';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ladin-header',
    templateUrl: './header-ladin.component.html',
    styleUrls: ['./header-ladin.component.scss'],
    imports: [NzHeaderComponent, NzMenuDirective, NzMenuItemComponent, RouterLink, NzDividerComponent, NzIconDirective, TranslatePipe]
})
export class HeaderLadinComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  languageSelectionService = inject(LanguageSelectionService);


  frontendLanguage: FrontendLanguage = 'rm';

  private frontendLanguageSubscription: Subscription|null = null;

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
