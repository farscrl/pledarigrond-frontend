import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-idiom-card',
    templateUrl: './idiom-card.component.html',
    styleUrls: ['./idiom-card.component.scss'],
    imports: [NzCardComponent, RouterLink, TranslatePipe]
})
export class IdiomCardComponent implements OnInit {

  @Input()
  name: string = "";

  @Input()
  url: string = "";

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

}
