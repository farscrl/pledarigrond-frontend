import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FrontendLanguage, LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzHeaderComponent } from 'ng-zorro-antd/layout';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';

import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [NzHeaderComponent, NzMenuDirective, ɵNzTransitionPatchDirective, NzMenuItemComponent, RouterLink, NzDividerComponent, NzIconDirective, TranslatePipe]
})
export class HeaderComponent implements OnInit {

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
