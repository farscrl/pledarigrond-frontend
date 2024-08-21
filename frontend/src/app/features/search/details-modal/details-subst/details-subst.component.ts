import { Component, Input } from '@angular/core';
import { LemmaVersion } from '../../../../models/lemma-version';

@Component({
  selector: 'app-details-subst',
  templateUrl: './details-subst.component.html',
  styleUrl: './details-subst.component.scss'
})
export class DetailsSubstComponent {
  @Input()
  lemmaVersion?: LemmaVersion;
}
