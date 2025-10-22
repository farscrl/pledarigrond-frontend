import { Component, Input, OnInit } from '@angular/core';
import { NameCategory } from "../../../models/name";
import { NgIf } from '@angular/common';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-name-category',
    templateUrl: './name-category.component.html',
    styleUrls: ['./name-category.component.scss'],
    imports: [NgIf, NzTagComponent, TranslatePipe]
})
export class NameCategoryComponent implements OnInit {

  @Input()
  category?: NameCategory;

  constructor() { }

  ngOnInit(): void {
  }

}
