import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModalComponent } from "../../../services/modal-component";
import {FormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";

export interface SuggestWordSpellcheckerModalInput {
  word: string;
}

export interface SuggestWordSpellcheckerModalOutput {
  send: boolean;
  word: string;
  comment: string;
  email: string;
}

@Component({
  selector: 'app-suggest-word-spellchecker',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './suggest-word-spellchecker.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suggest-word-spellchecker.scss'
})
export class SuggestWordSpellchecker  extends ModalComponent<SuggestWordSpellcheckerModalInput, SuggestWordSpellcheckerModalOutput> {
  word: string = '';
  comment: string = '';
  email: string = '';

  constructor() {
    super();
  }

  async confirm() {
    this.result = {
      send: true,
      word: this.word,
      comment: this.comment,
      email: this.email
    }
    await this.close();
  }

  async cancel() {
    this.result = {
      send: false,
      word: '',
      comment: '',
      email: ''
    }

    await this.close();
  }
}
