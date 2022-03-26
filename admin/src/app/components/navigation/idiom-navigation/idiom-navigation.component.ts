import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-idiom-navigation',
  templateUrl: './idiom-navigation.component.html',
  styleUrls: ['./idiom-navigation.component.scss']
})
export class IdiomNavigationComponent implements OnInit {

  constructor(private router: Router, private languageSelectionService: LanguageSelectionService) { }

  ngOnInit(): void {
    this.languageSelectionService.setNewUrl(this.router.url);
  }

}
