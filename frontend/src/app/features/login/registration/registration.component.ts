import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SimpleModalComponent, SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends SimpleModalComponent<null, null> implements OnInit {

  email = '';
  password = '';
  repeatedPassword = '';
  errorMessage?: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private simpleModalService: SimpleModalService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  save() {
    this.errorMessage = undefined;

    if (this.email === "" || this.password === "") {
      this.errorMessage = this.translateService.instant('registration.error.email_or_pw_missing');
      return;
    }

    if (!this.isEmailValid(this.email)) {
      this.errorMessage = this.translateService.instant('registration.error.email_invalid');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = this.translateService.instant('registration.error.pw_too_short');
      return;
    }

    if (this.password !== this.repeatedPassword) {
      this.errorMessage = this.translateService.instant('registration.error.pw_not_same');
      return;
    }

    const user = new User();
    user.email = this.email;
    user.password = this.password;

    this.authService.register(user).subscribe(data => {
      this.authService.authSuccess(data.token);
      this.cancel();
      this.redirect();
    }, error => {
      if (error.error.message === "User already exists.") {
        this.errorMessage = this.translateService.instant('registration.error.already_exists');
      } else {
        console.error(error);
      }
    });
  }

  private reset() {
    this.errorMessage = undefined;
    this.email = "";
    this.password = "";
    this.repeatedPassword = "";
  }

  cancel() {
    this.reset();
    this.simpleModalService.removeAll();
  }

  private redirect() {
    const queryParams = this.route.snapshot.queryParams;
    let redirect = queryParams['redirect'];
    if (!redirect) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    this.router.navigateByUrl(decodeURI(redirect));
  }

  private isEmailValid(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
}
