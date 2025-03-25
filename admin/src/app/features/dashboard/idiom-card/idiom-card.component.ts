import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-idiom-card',
    templateUrl: './idiom-card.component.html',
    styleUrls: ['./idiom-card.component.scss'],
    standalone: false
})
export class IdiomCardComponent implements OnInit {

  @Input()
  name: string = "";

  @Input()
  url: string = "";

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

}
