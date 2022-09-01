import { Component, Input, OnInit } from '@angular/core';
import { NameCategory } from "../../../models/name";

@Component({
  selector: 'app-name-category',
  templateUrl: './name-category.component.html',
  styleUrls: ['./name-category.component.scss']
})
export class NameCategoryComponent implements OnInit {

  @Input()
  category?: NameCategory;

  constructor() { }

  ngOnInit(): void {
  }

}
