import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvironmentService } from "../../services/environment.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public environmentService: EnvironmentService,
  ) { }

  ngOnInit(): void {
  }

}
