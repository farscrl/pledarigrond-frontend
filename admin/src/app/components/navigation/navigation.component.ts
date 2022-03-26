import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isEditorSubnaviOpen = false;
  isAdminSubnaviOpen = false;

  constructor(public languageSelectionService: LanguageSelectionService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.checkOpenSubnavi(val.url);
      }
    });
    this.checkOpenSubnavi(this.router.url);
  }

  private checkOpenSubnavi(url: string) {
    const segments = url.split('/');

      if (segments.length >= 4) {
        console.log(segments);
        if (segments[3] === 'editor') {
          this.isEditorSubnaviOpen = true;
          this.isAdminSubnaviOpen = false;
        } else if (segments[3] === 'admin') {
          this.isAdminSubnaviOpen = true;
          this.isEditorSubnaviOpen = false;
        }
      }
  }
}
