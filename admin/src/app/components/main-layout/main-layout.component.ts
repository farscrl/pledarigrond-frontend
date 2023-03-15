import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from "../../services/environment.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(public environmentService: EnvironmentService) { }

  ngOnInit(): void {
  }

}
