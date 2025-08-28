import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { EditComponent } from './edit/edit.component';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from "../../services/environment.service";
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-user-administration',
    templateUrl: './user-administration.component.html',
    styleUrls: ['./user-administration.component.scss'],
    standalone: false
})
export class UserAdministrationComponent implements OnInit {

  listOfUsers: User[] = [];
  isLoading = false;
  currentPage = 1;
  totalItems = 0;

  constructor(
    private usersService: UsersService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService,
    public environmentService: EnvironmentService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
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

  loadPage(data: number) {
    this.currentPage = data;
    this.loadUsers();
  }

  private deleteConfirmed(email: string) {
    this.usersService.delete(email).subscribe(() => {
      this.loadUsers();
      this.notificationService.success('Stizzà cun success l\'utilisader', '', 5000);
    }, error => {
      console.error(error);
      this.notificationService.error('Errur cun stizzar l\'utilisader', '', 15000);
    });
  }

  private loadUsers() {
    this.isLoading = true;
    this.usersService.getAll(this.currentPage).subscribe(data => {
      this.listOfUsers = data.content;
      this.totalItems = data.totalElements;
      this.isLoading = false;

      if (data.number >= data.totalPages) {
        this.currentPage--;
        this.loadUsers();
      }
    }, error => {
      console.error(error);
      this.isLoading = false;
    });
  }
}
