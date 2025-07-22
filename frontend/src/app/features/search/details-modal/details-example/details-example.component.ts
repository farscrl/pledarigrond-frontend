import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';
import { EntryVersionDto } from '../../../../models/dictionary';

@Component({
    selector: 'app-details-example',
    templateUrl: './details-example.component.html',
    styleUrl: './details-example.component.scss',
    imports: [TranslatePipe]
})
export class DetailsExampleComponent  {

  @Input()
  version?: EntryVersionDto;
}
