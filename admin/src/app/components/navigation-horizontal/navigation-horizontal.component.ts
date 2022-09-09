import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-navigation-horizontal',
  templateUrl: './navigation-horizontal.component.html',
  styleUrls: ['./navigation-horizontal.component.scss']
})
export class NavigationHorizontalComponent implements OnInit {

  constructor(
    public languageSelectionService: LanguageSelectionService,
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
  }

  openFe() {
    window.open(environment.frontendUrl + "/" + this.languageSelectionService.getCurrentLanguage(), '_blank');
  }

  showAutomaticReview(): boolean {
    return this.languageSelectionService.getCurrentLanguage() === 'rumantschgrischun';
  }
}
