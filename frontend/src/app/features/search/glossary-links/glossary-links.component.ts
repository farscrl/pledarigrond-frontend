import { Component, OnInit } from '@angular/core';
import { OtherResourcesComponent, OtherResourcesType } from '../../other-resources/other-resources.component';
import { SimpleModalService } from "ngx-simple-modal";
import { SelectedLanguageService } from "../../../services/selected-language.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-glossary-links',
  templateUrl: './glossary-links.component.html',
  styleUrls: ['./glossary-links.component.scss']
})
export class GlossaryLinksComponent implements OnInit {

  idiom = '';

  private idiomSubscription?: Subscription;

    constructor(
    private simpleModalService: SimpleModalService,
    private selectedLanguageService: SelectedLanguageService,
  ) { }

  ngOnInit(): void {
    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(lng => {
      this.idiom = this.selectedLanguageService.getSelectedLanguageUrlSegment();
    });
  }

  showSpellchecker() {
      return this.idiom === 'surmiran' || this.idiom === 'sutsilvan';
  }

  ngOnDestroy(): void {
    if (this.idiomSubscription) {
      this.idiomSubscription.unsubscribe();
    }
  }

  openLinksModal(type: OtherResourcesType) {
    this.simpleModalService.addModal(OtherResourcesComponent, {resourceType: type})
      .subscribe();
  }
}
