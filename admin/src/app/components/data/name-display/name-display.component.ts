import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-name-display',
    templateUrl: './name-display.component.html',
    styleUrls: ['./name-display.component.scss'],
    imports: [NgIf]
})
export class NameDisplayComponent implements OnInit {

  @Input()
  name?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
