import { Component, OnInit } from '@angular/core';
import { OtherResourcesComponent, OtherResourcesType } from '../../other-resources/other-resources.component';
import { SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-glossary-links',
  templateUrl: './glossary-links.component.html',
  styleUrls: ['./glossary-links.component.scss']
})
export class GlossaryLinksComponent implements OnInit {

  constructor(
    private simpleModalService: SimpleModalService,
  ) { }

  ngOnInit(): void {
  }

  openLinksModal(type: OtherResourcesType) {
    this.simpleModalService.addModal(OtherResourcesComponent, {resourceType: type})
      .subscribe();
  }
}
