import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Roles, User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Input()
  email?: string;

  isLoading = false;

  validateForm!: UntypedFormGroup;

  user: User = new User();

  constructor(private modal: NzModalRef, private fb: UntypedFormBuilder, private userService: UsersService) { }

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
        // TODO: inform notification service
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
      // TODO: notification service
    });
  }

  private updateUser(email: string) {
    const user = this.toUser(this.validateForm.value);
    this.userService.update(email, user).subscribe(result => {
      this.modal.triggerOk();
      // TODO: notification service
    });
  }

  private initForm() {
    this.validateForm = this.fb.group({
      email: [this.user.email, [Validators.email, Validators.required]],
      password: [this.user.password, !!this.email ? [] : [Validators.required, Validators.minLength(6)]],
      admin: [this.user.admin],
      rolePuter: [this.user.roles.puterRole, [Validators.required]],
      roleRumantschgrischun: [this.user.roles.rumantschgrischunRole, [Validators.required]],
      roleSurmiran: [this.user.roles.surmiranRole, [Validators.required]],
      roleSursilvan: [this.user.roles.sursilvanRole, [Validators.required]],
      roleSutsilvan: [this.user.roles.sutsilvanRole, [Validators.required]],
      roleVallader: [this.user.roles.valladerRole, [Validators.required]],
      roleNames: [this.user.roles.namesRole, [Validators.required]],
    });
  }

  private toUser(data: any): User {
    const roles = new Roles();
    roles.puterRole = data.rolePuter;
    roles.rumantschgrischunRole = data.roleRumantschgrischun;
    roles.surmiranRole = data.roleSurmiran;
    roles.sursilvanRole = data.roleSursilvan;
    roles.sutsilvanRole = data.roleSutsilvan;
    roles.valladerRole = data.roleVallader;
    roles.namesRole = data.roleNames;

    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.admin = data.admin;
    user.roles = roles;
    return user;
  }
}
