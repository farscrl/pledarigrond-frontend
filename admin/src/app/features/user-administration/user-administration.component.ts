import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditorRole, User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { EditComponent } from './edit/edit.component';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from "../../services/environment.service";

@Component({
    selector: 'app-user-administration',
    templateUrl: './user-administration.component.html',
    styleUrls: ['./user-administration.component.scss'],
    standalone: false
})
export class UserAdministrationComponent implements OnInit {

  listOfUsers: User[] = [];

  constructor(
    private usersService: UsersService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService,
    public environmentService: EnvironmentService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  roleToColor(role: EditorRole) {
    switch(role) {
      case 'EDITOR':
      case 'ADMIN':
        return 'green';
      case 'NONE':
      case 'GUEST':
        return 'red';
    }
  }

  newOrEdit(email?: string): void {
    const modal = this.modalService.create({
      nzTitle: email ? this.translateService.instant('users.edit_title') : this.translateService.instant('users.new_title'),
      nzContent: EditComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        email: email,
      },
      nzOnOk: () => this.loadUsers(),
    });
  }

  delete(email: string) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('users.delete_question'),
      nzContent: email,
      nzOnOk: () => this.deleteConfirmed(email),
      nzOkText: this.translateService.instant('users.delete_yes'),
      nzCancelText: this.translateService.instant('users.delete_no')
    });
  }

  private deleteConfirmed(email: string) {
    this.usersService.delete(email).subscribe(() => {
      this.loadUsers();
      // TODO: message success
    }, error => {
      console.error(error);
      // TODO: message error
    });
  }

  private loadUsers() {
    this.usersService.getAll().subscribe(data => {
      this.listOfUsers = data.content;
    });
  }
}
