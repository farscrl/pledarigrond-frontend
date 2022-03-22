import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials } from 'src/app/models/security';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = "";
  password = "";

  hasLoginError = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

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
}
