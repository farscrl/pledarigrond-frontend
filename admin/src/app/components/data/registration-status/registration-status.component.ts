import { Component, Input } from '@angular/core';
import { RegistrationStatus } from '../../../models/registration';

@Component({
    selector: 'app-registration-status',
    templateUrl: './registration-status.component.html',
    styleUrl: './registration-status.component.scss',
    standalone: false
})
export class RegistrationStatusComponent {
  
  @Input()
  status?: RegistrationStatus;
}
