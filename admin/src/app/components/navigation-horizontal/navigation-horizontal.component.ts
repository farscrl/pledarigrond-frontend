import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { environment } from './../../../environments/environment';
import { Language } from "../../models/security";

import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-navigation-horizontal',
    templateUrl: './navigation-horizontal.component.html',
    styleUrls: ['./navigation-horizontal.component.scss'],
    imports: [NzMenuDirective, NzIconDirective, NzMenuItemComponent, RouterLink, NzDividerComponent, TranslatePipe]
})
export class NavigationHorizontalComponent implements OnInit {
  languageSelectionService = inject(LanguageSelectionService);
  authService = inject(AuthService);


  currentLanguage: Language = Language.UNDEFINED;

  ngOnInit(): void {
    this.languageSelectionService.getCurrentLanguageObservable().subscribe(l => {
      this.currentLanguage = l;
    });
  }

  openFe() {
    window.open(environment.frontendUrl + "/" + this.currentLanguage, '_blank');
  }

  showPronunciationReview(): boolean {
    return true;
  }

  showFrontendLink(): boolean {
    return this.currentLanguage !== 'puter' && this.currentLanguage !== 'vallader';
  }
}
