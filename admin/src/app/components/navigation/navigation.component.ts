import { Component, OnInit } from '@angular/core';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(public languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {}

  openFe() {
    window.open(environment.frontendUrl + "/" + this.languageSelectionService.getCurrentLanguage(), '_blank');
  }
}
