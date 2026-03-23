import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../../models/dictionary';
import { formatFormVariants } from '../../../../utils/word-utils';


@Component({
    selector: 'app-details-subst',
    templateUrl: './details-subst.component.html',
    styleUrl: './details-subst.component.scss',
    imports: [TranslatePipe]
})
export class DetailsSubstComponent {
  @Input()
  version?: EntryVersionDto;

  public formatFormVariants = formatFormVariants;
}
