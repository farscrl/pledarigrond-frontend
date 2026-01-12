import { Component, Input } from '@angular/core';
import { Language } from "../../models/security";
import { EntryVersionInternalDto } from '../../models/dictionary';
import { NzDescriptionsComponent, NzDescriptionsItemComponent } from 'ng-zorro-antd/descriptions';
import { DiffComponent } from '../diff/diff.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-lemma-diff',
    templateUrl: './lemma-diff.component.html',
    styleUrls: ['./lemma-diff.component.scss'],
    imports: [NzDescriptionsComponent, NzDescriptionsItemComponent, DiffComponent, TranslatePipe]
})
export class LemmaDiffComponent {
  @Input()
  language: Language = Language.RUMANTSCHGRISCHUN;

  @Input()
  originalVersion: EntryVersionInternalDto = new EntryVersionInternalDto();

  @Input()
  changedVersion: EntryVersionInternalDto = new EntryVersionInternalDto();

  @Input()
  showComments = false;
}
