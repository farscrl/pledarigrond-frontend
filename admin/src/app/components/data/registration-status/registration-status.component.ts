import { Component, Input } from '@angular/core';
import { RegistrationStatus } from '../../../models/registration';

import { NzTagComponent } from 'ng-zorro-antd/tag';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-registration-status',
    templateUrl: './registration-status.component.html',
    styleUrl: './registration-status.component.scss',
    imports: [NzTagComponent, TranslatePipe]
})
export class RegistrationStatusComponent {
  
  @Input()
  status?: RegistrationStatus;
}
