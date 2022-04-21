import { Component, Input, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-other-resources',
  templateUrl: './other-resources.component.html',
  styleUrls: ['./other-resources.component.scss']
})
export class OtherResourcesComponent extends SimpleModalComponent<{resourceType: OtherResourcesType|undefined}, null> implements OnInit {

  @Input()
  resourceType?: OtherResourcesType;

  constructor(
    private simpleModalService: SimpleModalService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

}

export type OtherResourcesType = 'dictionaries' | 'glossaries';
