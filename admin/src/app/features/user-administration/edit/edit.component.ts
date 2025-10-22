import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { Roles, User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { EnvironmentService } from "../../../services/environment.service";
import { NotificationService } from '../../../services/notification.service';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NgIf } from '@angular/common';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { TranslatePipe } from '@ngx-translate/core';

export class EditUserData {
  email?: string;
}

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    imports: [FormsModule, NzFormDirective, ReactiveFormsModule, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzInputDirective, NgIf, NzCheckboxComponent, NzSelectComponent, NzOptionComponent, NzModalFooterDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, TranslatePipe]
})
export class EditComponent implements OnInit {

  email?: string;

  isLoading = false;

  validateForm!: UntypedFormGroup;

  user: User = new User();

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private userService: UsersService,
    public environmentService: EnvironmentService,
    @Inject(NZ_MODAL_DATA) data: EditUserData,
    private notificationService: NotificationService,
  ) {
    this.email = data.email;
  }

  ngOnInit(): void {
    if (!!this.email) {
      this.isLoading = true;
      this.userService.getOne(this.email).subscribe(data => {
        this.user = data;
        this.isLoading = false;
        this.initForm();
      },
      error => {
        console.error(error);
        this.notificationService.error('Errur cun chargiar l\'utilisader', '', 15000);
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
      if (!this.email) {
        this.createNewUser();
      } else {
        this.updateUser(this.email);
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

  private createNewUser() {
    const user = this.toUser(this.validateForm.value);
    this.userService.create(user).subscribe(result => {
      this.modal.triggerOk();
      this.notificationService.success('Memorisà l\'utilisader', '', 5000);
    }, error => {
      console.error(error);
      this.notificationService.error('Errur cun memorisar l\'utilisader', '', 15000);
      this.modal.close();
    });
  }

  private updateUser(email: string) {
    const user = this.toUser(this.validateForm.value);
    this.userService.update(email, user).subscribe(result => {
      this.modal.triggerOk();
      this.notificationService.success('Memorisà l\'utilisader', '', 5000);
    }, error => {
      console.error(error);
      this.notificationService.error('Errur cun memorisar l\'utilisader', '', 15000);
      this.modal.close();
    });
  }

  private initForm() {
    this.validateForm = this.fb.group({
      email: [this.user.email, [Validators.email, Validators.required]],
      password: [this.user.password, !!this.email ? [] : [Validators.required, Validators.minLength(6)]],
      admin: [this.user.admin],
      rolePuter: [this.user.roles.rolePuter, [Validators.required]],
      roleRumantschgrischun: [this.user.roles.roleRumantschGrischun, [Validators.required]],
      roleSurmiran: [this.user.roles.roleSurmiran, [Validators.required]],
      roleSursilvan: [this.user.roles.roleSursilvan, [Validators.required]],
      roleSutsilvan: [this.user.roles.roleSutsilvan, [Validators.required]],
      roleVallader: [this.user.roles.roleVallader, [Validators.required]],
      roleNames: [this.user.roles.roleNames, [Validators.required]],
      roleRegistrations: [this.user.roles.roleRegistrations, [Validators.required]],
    });
  }

  private toUser(data: any): User {
    const roles = new Roles();
    roles.rolePuter = data.rolePuter;
    roles.roleRumantschGrischun = data.roleRumantschgrischun;
    roles.roleSurmiran = data.roleSurmiran;
    roles.roleSursilvan = data.roleSursilvan;
    roles.roleSutsilvan = data.roleSutsilvan;
    roles.roleVallader = data.roleVallader;
    roles.roleNames = data.roleNames;
    roles.roleRegistrations = data.roleRegistrations;

    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.admin = data.admin;
    user.roles = roles;
    return user;
  }
}
