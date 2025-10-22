import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials } from 'src/app/models/security';
import { AuthService } from 'src/app/services/auth.service';
import { NzFormDirective, NzFormItemComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputGroupComponent, NzInputDirective } from 'ng-zorro-antd/input';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, NzFormDirective, ReactiveFormsModule, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormControlComponent, ɵNzTransitionPatchDirective, NzSpaceCompactItemDirective, NzInputGroupComponent, NzInputDirective, NzButtonComponent, NzWaveDirective, TranslatePipe]
})
export class LoginComponent implements OnInit {

  validateForm!: UntypedFormGroup;
  showError = false;

  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router: Router) {}

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
