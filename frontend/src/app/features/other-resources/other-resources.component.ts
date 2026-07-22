import { Component, Input, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ModalComponent } from 'src/app/services/modal-component';
import { ModalService } from 'src/app/services/modal.service';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-other-resources',
    templateUrl: './other-resources.component.html',
    styleUrls: ['./other-resources.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe]
})
export class OtherResourcesComponent extends ModalComponent<{resourceType: OtherResourcesType|undefined}, null> implements OnInit {
  private modalService = inject(ModalService);


  @Input()
  resourceType?: OtherResourcesType;

  ngOnInit(): void {
  }

}

export type OtherResourcesType = 'dictionaries' | 'glossaries';
