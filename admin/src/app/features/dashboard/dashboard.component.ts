import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvironmentService } from "../../services/environment.service";
import { NzLayoutComponent } from 'ng-zorro-antd/layout';

import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { IdiomCardComponent } from './idiom-card/idiom-card.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [NzLayoutComponent, NzRowDirective, NzColDirective, IdiomCardComponent]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  environmentService = inject(EnvironmentService);


  ngOnInit(): void {
  }

}
