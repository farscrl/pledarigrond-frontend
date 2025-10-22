import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { DbSearchCriteria } from 'src/app/models/db-search-criteria';
import { ngDebounce } from "../../../decorators/debounce.decorator";
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzDatePickerComponent, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzInputDirective } from 'ng-zorro-antd/input';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-duration',
    templateUrl: './duration.component.html',
    styleUrls: ['./duration.component.scss'],
    imports: [NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzDatePickerComponent, NzRangePickerComponent, FormsModule, ɵNzTransitionPatchDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzInputDirective, NzIconDirective, NzTooltipDirective, NzButtonComponent, NzWaveDirective, TranslatePipe]
})
export class DurationComponent implements OnInit {

  @Output()
  dateRangeSelected = new EventEmitter<DbSearchCriteria>();

  @Input()  set userFilter(userFilter: string | undefined)  { this.selectedUserFilter = userFilter; this.filter(); };
  @Output() userFilterChange = new EventEmitter<string | undefined>();

  selectedDuration: Date[] = [];
  selectedUserFilter?: string;

  private editorQuery: DbSearchCriteria = new DbSearchCriteria();

  constructor() { }

  ngOnInit(): void {
    this.resetDate();
  }

  @ngDebounce(10)
  filter() {
    this.editorQuery.startTime = !!this.selectedDuration[0] ? this.selectedDuration[0].getTime() : undefined;
    this.editorQuery.endTime = !!this.selectedDuration[1] ? this.selectedDuration[1].getTime() : undefined;
    this.editorQuery.userOrIp = !!this.selectedUserFilter ? this.selectedUserFilter : undefined;

    this.dateRangeSelected.emit(this.editorQuery);
  }

  resetDate() {
    this.selectedDuration = [
      moment().endOf('day').subtract(10, 'years').toDate(),
      moment().endOf('day').toDate()
    ]
    this.removeUserFilter()
    this.filter();
  }

  removeUserFilter() {
    this.userFilter = undefined;
    this.userFilterChange.emit(undefined);
  }
}
