import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { TranslateService } from "@ngx-translate/core";
import { EditNameComponent } from "./edit-name/edit-name.component";
import { NameService } from "../../services/name.service";
import { Name } from "../../models/name";
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-name-administration',
    templateUrl: './name-administration.component.html',
    styleUrls: ['./name-administration.component.scss'],
    standalone: false
})
export class NameAdministrationComponent implements OnInit {

  currentPage: Name[] = [];
  totalElements = 0;
  pageNumber = 1;
  pageSize = 10;
  isLoading = true;

  nameFilter = "";
  categoryFilter = "";

  constructor(
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService,
    private nameService: NameService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter() {
    this.loadPage(1, this.pageSize);
  }

  newOrEdit(id?: string): void {
    const modal = this.modalService.create({
      nzTitle: id ? this.translateService.instant('names.edit_title') : this.translateService.instant('names.new_title'),
      nzContent: EditNameComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        id: id,
      },
      nzOnOk: () => this.loadPage(this.pageNumber, this.pageSize),
    });
  }

  delete(name: Name) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('names.delete_question'),
      nzContent: name.nameRumantschGrischun,
      nzOnOk: () => this.deleteConfirmed(name.id!),
      nzOkText: this.translateService.instant('names.delete_yes'),
      nzCancelText: this.translateService.instant('names.delete_no')
    });
  }

  changePage(pageNumber: number) {
    this.loadPage(pageNumber, this.pageSize);
  }

  changePageSize(size: number) {
    this.pageNumber = 1;
    this.pageSize = size;
    this.loadPage(this.pageNumber, this.pageSize);
  }

  private deleteConfirmed(email: string) {
    this.nameService.delete(email).subscribe(() => {
      this.loadPage(this.pageNumber, this.pageSize);
      this.notificationService.success('names.success', '', 5000);
    }, error => {
      console.error(error);
      this.notificationService.error('names.error', '', 15000);
    });
  }

  private loadPage(pageNumber: number, pageSize: number) {
    this.isLoading = true;
    this.nameService.getAll(pageNumber - 1, pageSize, this.nameFilter, this.categoryFilter).subscribe(data => {
      this.currentPage = data.content;
      this.totalElements = data.totalElements;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.isLoading = false;
    });
  }
}
