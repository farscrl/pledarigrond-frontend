import { Component, Input } from '@angular/core';
import { Language } from "../../models/security";
import { ReferenceVerbDto } from '../../models/reference-verb-dto';
import { EntryVersionInternalDto } from '../../models/dictionary';
import { NzDescriptionsComponent, NzDescriptionsItemComponent } from 'ng-zorro-antd/descriptions';
import { DiffComponent } from '../diff/diff.component';

import { NzTrDirective, NzTableCellDirective, NzThMeasureDirective } from 'ng-zorro-antd/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-lemma-diff',
    templateUrl: './lemma-diff.component.html',
    styleUrls: ['./lemma-diff.component.scss'],
    imports: [NzDescriptionsComponent, NzDescriptionsItemComponent, DiffComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, TranslatePipe]
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

  @Input()
  referenceVerb?: ReferenceVerbDto;

  removeSursilvanPronouns(value?: string): string|undefined {
    if (value === undefined) {
      return undefined;
    }

    const prefixes = ['che ', 'ch\'', 'jeu ', 'ti ', 'el/ella ', 'i ', 'nus ', 'vus ', 'els/ellas ']
    const singleForms: string[] = value.split(/\r?\n|\r|\u0085|\u2028|\u2029/);
    for (let i = 0; i < singleForms.length; i++) {
      if (singleForms[i].trim() === '') {
        continue;
      }
      let enclosedInBrackets = false;
      if (singleForms[i].charAt(0) === '(' && singleForms[i].charAt(singleForms[i].length - 1) === ')') {
        enclosedInBrackets = true;
        singleForms[i] = singleForms[i].replace("(", "").replace(")", "");
      }
      for (const p of prefixes) {
        if (singleForms[i].startsWith(p)) {
          singleForms[i] = singleForms[i].substring(p.length).trim();
        }
      }
      singleForms[i] = singleForms[i].replace(/!$/, '').trim();
      if (enclosedInBrackets) {
        singleForms[i] = "(" + singleForms[i] + ")";
      }
    }
    return singleForms.join("\n");
  }
}
