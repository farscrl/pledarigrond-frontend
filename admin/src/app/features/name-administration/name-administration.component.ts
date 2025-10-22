import { Component, OnInit, ViewContainerRef, inject } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { EditNameComponent } from "./edit-name/edit-name.component";
import { NameService } from "../../services/name.service";
import { Name } from "../../models/name";
import { NotificationService } from '../../services/notification.service';
import { NzLayoutComponent, NzContentComponent } from 'ng-zorro-antd/layout';
import { NzPageHeaderComponent, NzPageHeaderTitleDirective, NzPageHeaderSubtitleDirective, NzPageHeaderExtraDirective } from 'ng-zorro-antd/page-header';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzCollapseComponent, NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { FormsModule } from '@angular/forms';
import { NzFormDirective, NzFormItemComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzCellAlignDirective, NzTbodyComponent } from 'ng-zorro-antd/table';

import { NameDisplayComponent } from '../../components/data/name-display/name-display.component';
import { NameCategoryComponent } from '../../components/data/name-category/name-category.component';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

@Component({
    selector: 'app-name-administration',
    templateUrl: './name-administration.component.html',
    styleUrls: ['./name-administration.component.scss'],
    imports: [NzLayoutComponent, NzContentComponent, NzPageHeaderComponent, NzPageHeaderTitleDirective, NzPageHeaderSubtitleDirective, NzPageHeaderExtraDirective, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, NzCollapseComponent, NzCollapsePanelComponent, FormsModule, NzFormDirective, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormControlComponent, NzInputDirective, NzSelectComponent, NzOptionComponent, NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzCellAlignDirective, NzTbodyComponent, NameDisplayComponent, NameCategoryComponent, NzDividerComponent, TranslatePipe]
})
export class NameAdministrationComponent implements OnInit {
  private modalService = inject(NzModalService);
  private viewContainerRef = inject(ViewContainerRef);
  private translateService = inject(TranslateService);
  private nameService = inject(NameService);
  private notificationService = inject(NotificationService);


  currentPage: Name[] = [];
  totalElements = 0;
  pageNumber = 1;
  pageSize = 10;
  isLoading = true;

  nameFilter = "";
  categoryFilter = "";

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
