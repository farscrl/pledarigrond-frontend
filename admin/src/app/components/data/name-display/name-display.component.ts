import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-name-display',
  templateUrl: './name-display.component.html',
  styleUrls: ['./name-display.component.scss']
})
export class NameDisplayComponent implements OnInit {

  @Input()
  name?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
