import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { EditorQuery } from 'src/app/models/editor-query';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent implements OnInit {

  @Output()
  dateRangeSelected = new EventEmitter<EditorQuery>();

  @Input()  set userFilter(userFilter: string | undefined)  { this.selectedUserFilter = userFilter; this.filter(); };
  @Output() userFilterChange = new EventEmitter<string | undefined>();

  @Input()  set verifierFilter(verifierFilter: string | undefined) { this.selectedVerifierFilter = verifierFilter; this.filter(); };
  @Output() verifierFilterChange = new EventEmitter<string | undefined>();

  selectedDuration: Date[] = [];
  selectedUserFilter?: string;
  selectedVerifierFilter?: string;

  private editorQuery: EditorQuery = new EditorQuery();

  constructor() { }

  ngOnInit(): void {
    this.resetDate();
  }

  filter() {
    this.editorQuery.startTime = !!this.selectedDuration[0] ? this.selectedDuration[0].getTime() : undefined;
    this.editorQuery.endTime = !!this.selectedDuration[1] ? this.selectedDuration[1].getTime() : undefined;
    this.editorQuery.userOrIp = !!this.selectedUserFilter ? this.selectedUserFilter : undefined;
    this.editorQuery.verifier = !!this.selectedVerifierFilter ? this.selectedVerifierFilter : undefined;

    this.dateRangeSelected.emit(this.editorQuery);
  }

  resetDate() {
    this.selectedDuration = [
      moment().endOf('day').subtract(6, 'months').toDate(),
      moment().endOf('day').toDate()
    ]
    this.removeUserFilter()
    this.removeVerifierFilter();
    this.filter();
  }

  removeUserFilter() {
    this.userFilter = undefined;
    this.userFilterChange.emit(undefined);
  }

  removeVerifierFilter() {
    this.verifierFilter = undefined;
    this.verifierFilterChange.emit(undefined);
  }
}
