import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { NgxModalComponent, NgxModalService } from "ngx-modalview";
import { Idiom, SelectedLanguageService } from '../../../services/selected-language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss']
})
export class DetailsModalComponent extends NgxModalComponent<{lemmaVersion?: LemmaVersion}, null> implements OnInit, OnDestroy {

  @Input()
  lemmaVersion?: LemmaVersion;

  idiom: Idiom = 'rumgr';
  private idiomSubscription: Subscription;

  constructor(private modalService: NgxModalService, private selectedLanguageService: SelectedLanguageService) {
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
