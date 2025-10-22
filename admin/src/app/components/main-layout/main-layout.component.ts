import { Component, OnInit, inject } from '@angular/core';
import { EnvironmentService } from "../../services/environment.service";
import { NzLayoutComponent } from 'ng-zorro-antd/layout';

import { HeaderComponent } from '../header/header.component';
import { HeaderLadinComponent } from '../header-ladin/header-ladin.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
    imports: [NzLayoutComponent, HeaderComponent, HeaderLadinComponent, RouterOutlet]
})
export class MainLayoutComponent implements OnInit {
  environmentService = inject(EnvironmentService);


  ngOnInit(): void {
  }

}
