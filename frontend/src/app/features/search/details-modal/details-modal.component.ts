import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { NgxModalComponent, NgxModalService } from "ngx-modalview";
import { Idiom, SelectedLanguageService } from '../../../services/selected-language.service';
import { Subscription } from 'rxjs';

import { DetailsExampleComponent } from './details-example/details-example.component';
import { DetailsVerbComponent } from './details-verb/details-verb.component';
import { DetailsSubstComponent } from './details-subst/details-subst.component';
import { DetailsAdjComponent } from './details-adj/details-adj.component';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../models/dictionary';

@Component({
    selector: 'app-details-modal',
    templateUrl: './details-modal.component.html',
    styleUrls: ['./details-modal.component.scss'],
    imports: [DetailsExampleComponent, DetailsVerbComponent, DetailsSubstComponent, DetailsAdjComponent, TranslatePipe]
})
export class DetailsModalComponent extends NgxModalComponent<{version?: EntryVersionDto}, null> implements OnInit, OnDestroy {
  private modalService = inject(NgxModalService);
  private selectedLanguageService = inject(SelectedLanguageService);


  @Input()
  version?: EntryVersionDto;

  idiom: Idiom = 'rumgr';
  private idiomSubscription: Subscription;

  constructor() {
    super();

    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe((idiom) => {
      this.idiom = idiom;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.idiomSubscription) {
      this.idiomSubscription.unsubscribe();
    }
  }

  closeOverlay() {
    this.modalService.removeAll();
  }

  removeCf(input: string | undefined) {
    if (!input) {
      return '';
    }
    if (input.startsWith('cf. ')) {
      return input.slice(4);
    }
    return input;
  }
}
