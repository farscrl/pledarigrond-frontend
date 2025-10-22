import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-no-permissions',
    templateUrl: './no-permissions.component.html',
    styleUrls: ['./no-permissions.component.scss'],
    imports: [TranslatePipe]
})
export class NoPermissionsComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);


  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
