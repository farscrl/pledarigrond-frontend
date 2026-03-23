import { Component, Input, OnInit } from '@angular/core';
import { formatFormVariants } from '../../../../../utils/word-utils';


@Component({
    selector: 'app-conjugation-personal',
    templateUrl: './conjugation-personal.component.html',
    styleUrls: ['./conjugation-personal.component.scss'],
    imports: []
})
export class ConjugationPersonalComponent implements OnInit {
  @Input() public title?: string;

  @Input() public sing1?: string;
  @Input() public sing1Pronoun?: string;

  @Input() public sing2?: string;
  @Input() public sing2Pronoun?: string;

  @Input() public sing3?: string;
  @Input() public sing3Pronoun?: string;

  @Input() public sing3Alt?: string;
  @Input() public sing3PronounAlt?: string;

  @Input() public plural1?: string;
  @Input() public plural1Pronoun?: string;

  @Input() public plural2?: string;
  @Input() public plural2Pronoun?: string;

  @Input() public plural3?: string;
  @Input() public plural3Pronoun?: string;

  @Input() public searchString?: string

  constructor() {}

  ngOnInit() {}

  public formatFormVariants = formatFormVariants;
}
