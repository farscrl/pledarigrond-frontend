import { Component, Input } from '@angular/core';
import { LemmaVersion } from '../../../../models/lemma-version';

@Component({
  selector: 'app-details-adj',
  templateUrl: './details-adj.component.html',
  styleUrl: './details-adj.component.scss'
})
export class DetailsAdjComponent {
  @Input()
  lemmaVersion?: LemmaVersion;
}
