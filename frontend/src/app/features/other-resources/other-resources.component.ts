import { Component, Input, OnInit } from '@angular/core';
import {NgxModalComponent, NgxModalService} from "ngx-modalview";

@Component({
  selector: 'app-other-resources',
  templateUrl: './other-resources.component.html',
  styleUrls: ['./other-resources.component.scss']
})
export class OtherResourcesComponent extends NgxModalComponent<{resourceType: OtherResourcesType|undefined}, null> implements OnInit {

  @Input()
  resourceType?: OtherResourcesType;

  constructor(
    private modalService: NgxModalService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

}

export type OtherResourcesType = 'dictionaries' | 'glossaries';
