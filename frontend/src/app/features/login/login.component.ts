import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials } from 'src/app/models/security';
import { AuthService } from 'src/app/services/auth.service';
import {NgxModalComponent, NgxModalService} from "ngx-modalview";
import { RegistrationComponent } from './registration/registration.component';

import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, TranslatePipe]
})
export class LoginComponent implements OnInit {

  username = "";
  password = "";

  hasLoginError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgxModalService,
  ) { }

  ngOnInit(): void {
    this.reset();
  }

  login() {
    const credentials = new Credentials();
    credentials.username = this.username;
    credentials.password = this.password;

    this.authService.login(credentials).subscribe(data => {
      this.authService.authSuccess(data.token);
      this.reset();
      this.redirect();
    }, error => {
      console.error(error);
      this.hasLoginError = true;
    });
  }

  private reset() {
    this.hasLoginError = false;
    this.username = "";
    this.password = "";
  }

  private redirect() {
    const queryParams = this.route.snapshot.queryParams;
    let redirect = queryParams['redirect'];
    if (!redirect) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    this.router.navigateByUrl(decodeURI(redirect));
  }

  openRegistrationModal() {
    this.modalService.addModal(RegistrationComponent, null)
      .subscribe();
  }
}
