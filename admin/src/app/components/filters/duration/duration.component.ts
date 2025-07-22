import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { EditorQuery } from 'src/app/models/editor-query';
import { ngDebounce } from "../../../decorators/debounce.decorator";

@Component({
    selector: 'app-duration',
    templateUrl: './duration.component.html',
    styleUrls: ['./duration.component.scss'],
    standalone: false
})
export class DurationComponent implements OnInit {

  @Output()
  dateRangeSelected = new EventEmitter<EditorQuery>();

  @Input()  set userFilter(userFilter: string | undefined)  { this.selectedUserFilter = userFilter; this.filter(); };
  @Output() userFilterChange = new EventEmitter<string | undefined>();
  
  selectedDuration: Date[] = [];
  selectedUserFilter?: string;

  private editorQuery: EditorQuery = new EditorQuery();

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
