import { Component, OnInit, inject } from '@angular/core';
import { OtherResourcesComponent, OtherResourcesType } from '../../other-resources/other-resources.component';
import { NgxModalService } from "ngx-modalview";
import { SelectedLanguageService } from "../../../services/selected-language.service";
import { Subscription } from "rxjs";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-glossary-links',
    templateUrl: './glossary-links.component.html',
    styleUrls: ['./glossary-links.component.scss'],
    imports: [TranslatePipe]
})
export class GlossaryLinksComponent implements OnInit {
  private modalService = inject(NgxModalService);
  private selectedLanguageService = inject(SelectedLanguageService);


  idiom = '';

  private idiomSubscription?: Subscription;

  ngOnInit(): void {
    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(lng => {
      this.idiom = this.selectedLanguageService.getSelectedLanguageUrlSegment();
    });
  }

  ngOnDestroy(): void {
    if (this.idiomSubscription) {
      this.idiomSubscription.unsubscribe();
    }
  }

  openLinksModal(type: OtherResourcesType) {
    this.modalService.addModal(OtherResourcesComponent, {resourceType: type})
      .subscribe();
  }
}
