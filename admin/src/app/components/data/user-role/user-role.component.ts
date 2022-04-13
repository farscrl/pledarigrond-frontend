import { Component, Input, OnInit } from '@angular/core';
import { EditorRole } from 'src/app/models/user';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {

  @Input()
  role?: EditorRole;

  constructor() { }

  ngOnInit(): void {
  }

}
