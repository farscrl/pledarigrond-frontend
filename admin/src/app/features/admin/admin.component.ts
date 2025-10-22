import { Component, OnInit } from '@angular/core';
import { NzLayoutComponent, NzContentComponent } from 'ng-zorro-antd/layout';
import { NavigationHorizontalComponent } from '../../components/navigation-horizontal/navigation-horizontal.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    imports: [NzLayoutComponent, NavigationHorizontalComponent, NzContentComponent, RouterOutlet]
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
