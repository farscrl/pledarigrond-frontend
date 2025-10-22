import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { environment } from './../../../environments/environment';
import { Language } from "../../models/security";
import { NgIf } from '@angular/common';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-navigation-horizontal',
    templateUrl: './navigation-horizontal.component.html',
    styleUrls: ['./navigation-horizontal.component.scss'],
    imports: [NgIf, NzMenuDirective, ɵNzTransitionPatchDirective, NzIconDirective, NzMenuItemComponent, RouterLink, NzDividerComponent, TranslatePipe]
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
