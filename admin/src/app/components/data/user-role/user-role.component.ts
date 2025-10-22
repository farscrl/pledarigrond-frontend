import { Component, Input, OnInit } from '@angular/core';
import { EditorRole } from 'src/app/models/user';
import { NgIf } from '@angular/common';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.scss'],
    imports: [NgIf, NzTagComponent, TranslatePipe]
})
export class UserRoleComponent implements OnInit {

  @Input()
  role?: EditorRole;

  constructor() { }

  ngOnInit(): void {
  }

}
