import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [RouterOutlet]
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
