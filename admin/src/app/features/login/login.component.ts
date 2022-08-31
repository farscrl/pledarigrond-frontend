import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials } from 'src/app/models/security';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
