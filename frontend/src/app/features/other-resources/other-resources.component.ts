import { Component, Input, OnInit, inject } from '@angular/core';
import {NgxModalComponent, NgxModalService} from "ngx-modalview";

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-other-resources',
    templateUrl: './other-resources.component.html',
    styleUrls: ['./other-resources.component.scss'],
    imports: [TranslatePipe]
})
export class OtherResourcesComponent extends NgxModalComponent<{resourceType: OtherResourcesType|undefined}, null> implements OnInit {
  private modalService = inject(NgxModalService);


  @Input()
  resourceType?: OtherResourcesType;

  ngOnInit(): void {
  }

}

export type OtherResourcesType = 'dictionaries' | 'glossaries';
