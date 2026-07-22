import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-static',
    templateUrl: './static.component.html',
    styleUrls: ['./static.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet]
})
export class StaticComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
