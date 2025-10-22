import { Component, OnInit } from '@angular/core';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NavigationHorizontalComponent } from '../../components/navigation-horizontal/navigation-horizontal.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    imports: [NzLayoutComponent, NavigationHorizontalComponent, RouterOutlet]
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
