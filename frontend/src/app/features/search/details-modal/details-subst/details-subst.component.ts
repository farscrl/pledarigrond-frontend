import { Component, Input } from '@angular/core';
import { EntryVersionDto } from '../../../../models/dictionary';


@Component({
    selector: 'app-details-subst',
    templateUrl: './details-subst.component.html',
    styleUrl: './details-subst.component.scss',
    imports: []
})
export class DetailsSubstComponent {
  @Input()
  version?: EntryVersionDto;
}
