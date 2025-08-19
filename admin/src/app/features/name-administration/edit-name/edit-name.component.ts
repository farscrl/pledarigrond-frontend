import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { Name } from "../../../models/name";
import { NameService } from "../../../services/name.service";
import { NotificationService } from '../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';

export class EditNameData {
  id?: string;
}

@Component({
    selector: 'app-edit-name',
    templateUrl: './edit-name.component.html',
    styleUrls: ['./edit-name.component.scss'],
    standalone: false
})
export class EditNameComponent implements OnInit {

  id?: string;

  isLoading = false;

  validateForm!: UntypedFormGroup;

  name: Name = new Name();

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private nameService: NameService,
    @Inject(NZ_MODAL_DATA) data: EditNameData,
    private notificationService: NotificationService,
    private translateService: TranslateService,
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    if (!!this.id) {
      this.isLoading = true;
      this.nameService.getOne(this.id).subscribe(data => {
          this.name = data;
          this.isLoading = false;
          this.initForm();
        },
        error => {
          console.error(error);
          this.notificationService.error('names.error', '', 15000);
          this.modal.close();
        })
    }
    this.initForm();
  }

  cancel() {
    this.modal.close();
  }

  save() {
    if (this.validateForm.valid) {
      if (!this.id) {
        this.createNewName();
      } else {
        this.updateName(this.id);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private createNewName() {
    const name = this.toName(this.validateForm.value);
    this.nameService.create(name).subscribe(result => {
      this.modal.triggerOk();
      this.notificationService.success('names.success', '', 5000);
    }, error => {
      console.error(error);
      this.notificationService.error('names.error', '', 15000);
      this.modal.close();
    });
  }

  private updateName(id: string) {
    const name = this.toName(this.validateForm.value);
    this.nameService.update(id, name).subscribe(result => {
      this.modal.triggerOk();
      this.notificationService.success('names.success', '', 5000);
    }, error => {
      console.error(error);
      this.notificationService.error('names.error', '', 15000);
      this.modal.close();
    });
  }

  private initForm() {
    this.validateForm = this.fb.group({
      nameRumantschGrischun: [this.name.nameRumantschGrischun, [Validators.required]],
      nameGerman: [this.name.nameGerman],
      category: [this.name.category],
      nameSursilvan: [this.name.nameSursilvan],
      nameSutsilvan: [this.name.nameSutsilvan],
      nameSurmiran: [this.name.nameSurmiran],
      namePuter: [this.name.namePuter],
      nameVallader: [this.name.nameVallader],
    });
  }

  private toName(data: any): Name {
    const name = new Name();

    name.id = this.id;
    name.nameRumantschGrischun = data.nameRumantschGrischun;
    name.nameGerman = data.nameGerman;
    name.category = data.category;
    name.nameSursilvan = data.nameSursilvan;
    name.nameSutsilvan = data.nameSutsilvan;
    name.nameSurmiran = data.nameSurmiran;
    name.namePuter = data.namePuter;
    name.nameVallader = data.nameVallader;

    return name;
  }

}
