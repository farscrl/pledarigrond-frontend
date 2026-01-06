import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { EditComponent } from './edit/edit.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from "../../services/environment.service";
import { NotificationService } from '../../services/notification.service';
import { NzContentComponent, NzLayoutComponent } from 'ng-zorro-antd/layout';
import {
  NzPageHeaderComponent,
  NzPageHeaderExtraDirective,
  NzPageHeaderTitleDirective
} from 'ng-zorro-antd/page-header';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NzCollapseComponent, NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import {
  NzCellAlignDirective,
  NzTableCellDirective,
  NzTableComponent,
  NzTbodyComponent,
  NzTheadComponent,
  NzThMeasureDirective,
  NzTrDirective
} from 'ng-zorro-antd/table';

import { NzIconDirective } from 'ng-zorro-antd/icon';
import { UserRoleComponent } from '../../components/data/user-role/user-role.component';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

@Component({
    selector: 'app-user-administration',
    templateUrl: './user-administration.component.html',
    styleUrls: ['./user-administration.component.scss'],
    imports: [NzLayoutComponent, NzContentComponent, NzPageHeaderComponent, NzPageHeaderTitleDirective, NzPageHeaderExtraDirective, NzButtonComponent, NzWaveDirective, NzCollapseComponent, NzCollapsePanelComponent, FormsModule, NzFormDirective, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormControlComponent, NzInputDirective, NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzCellAlignDirective, NzTbodyComponent, NzIconDirective, UserRoleComponent, NzDividerComponent, TranslatePipe]
})
export class UserAdministrationComponent implements OnInit {
  private usersService = inject(UsersService);
  private modalService = inject(NzModalService);
  private viewContainerRef = inject(ViewContainerRef);
  private translateService = inject(TranslateService);
  environmentService = inject(EnvironmentService);
  private notificationService = inject(NotificationService);


  listOfUsers: User[] = [];
  isLoading = false;
  currentPage = 1;
  totalItems = 0;

  searchText = '';

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
    this.usersService.getAll(this.currentPage, this.searchText).subscribe(data => {
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
