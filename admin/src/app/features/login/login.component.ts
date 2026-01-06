import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials } from 'src/app/models/security';
import { AuthService } from 'src/app/services/auth.service';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, NzFormDirective, ReactiveFormsModule, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormControlComponent, NzInputGroupComponent, NzInputDirective, NzButtonComponent, NzWaveDirective, TranslatePipe]
})
export class LoginComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);


  validateForm!: UntypedFormGroup;
  showError = false;

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const credentials = new Credentials();
      credentials.username = this.validateForm.value.userName;
      credentials.password = this.validateForm.value.password;

      this.authService.login(credentials).subscribe(data => {
        this.authService.authSuccess(data.token);
        this.showError = false;
        this.router.navigate(["admin"]);
      }, error => {
        console.error(error);
        this.showError = true;
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
