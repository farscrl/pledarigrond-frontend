import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditorRole, User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss']
})
export class UserAdministrationComponent implements OnInit {

  listOfUsers: User[] = [];

  constructor(private usersService: UsersService, private modalService: NzModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  roleToColor(role: EditorRole) {
    switch(role) {
      case 'EDITOR':
        return 'green';
      case 'NONE':
        return 'red';
    }
  }

  newOrEdit(email?: string): void {
    const modal = this.modalService.create({
      nzTitle: 'Modal Title',
      nzContent: EditComponent,
      nzClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        email: email,
      },
      nzOnOk: () => this.loadUsers(),
    });
  }

  delete(email: string) {
    this.modalService.confirm({
      nzTitle: 'Do you want to delete this user?',
      nzContent: email,
      nzOnOk: () => this.deleteConfirmed(email),
      nzOkText: 'Yes, delete',
      nzCancelText: 'No'
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
