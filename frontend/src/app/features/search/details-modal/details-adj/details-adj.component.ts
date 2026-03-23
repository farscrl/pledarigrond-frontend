import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../../models/dictionary';
import { formatFormVariants } from '../../../../utils/word-utils';


@Component({
    selector: 'app-details-adj',
    templateUrl: './details-adj.component.html',
    styleUrl: './details-adj.component.scss',
    imports: [TranslatePipe]
})
export class DetailsAdjComponent {
  @Input()
  version?: EntryVersionDto;

  public formatFormVariants = formatFormVariants;
}
