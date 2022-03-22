import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  showDetails = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
