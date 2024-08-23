import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conjugation-impersonal',
  templateUrl: './conjugation-impersonal.component.html',
  styleUrls: ['./conjugation-impersonal.component.scss'],
})
export class ConjugationImpersonalComponent implements OnInit {
  @Input() public title?: string;
  
  @Input() public form1?: string;

  @Input() public form2?: string;

  @Input() public form3?: string;

  @Input() public form4?: string;

  @Input() public form5?: string;

  @Input() public form6?: string;

  @Input() public searchString?: string

  constructor() {}

  ngOnInit() {}

  public replaceComma(input: string) {
    const items = input.split(/[,|\n]/);
    return items.map(e => {
      return e.trim();
    }).join("<br>")
  }
}
